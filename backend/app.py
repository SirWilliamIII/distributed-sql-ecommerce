from flask import Flask, request, jsonify
from flask_cors import CORS
from models import User, Product, Order
from db import SessionLocal, get_gateway_region
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from collections import defaultdict
import uuid

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://127.0.0.1:5173"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# --------------------- Validation --------------------- #
def validate_user_data(data):
    if not all(k in data for k in ("name", "email", "region")):
        raise ValueError("Missing required user fields")

def validate_product_data(data):
    if not all(k in data for k in ("name", "price", "stock")):
        raise ValueError("Missing required product fields")

def validate_order_data(data):
    if not all(k in data for k in ("user_id", "product_id", "quantity")):
        raise ValueError("Missing required order fields")

# --------------------- Routes --------------------- #

@app.route("/users", methods=["GET"])
def get_users():
    with SessionLocal() as db:
        users = db.query(User).options(joinedload(User.orders).joinedload(Order.product)).all()
        return jsonify([
            {
                "id": str(u.id),
                "name": u.name,
                "email": u.email,
                "region": u.region,
                "crdb_region": u.crdb_region,
                "products": [o.product.name for o in u.orders if o.product]
            }
            for u in users
        ])

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.json
    try:
        validate_user_data(data)
        with SessionLocal() as db:
            user = User(
                id=uuid.uuid4(),
                name=data["name"],
                email=data["email"],
                region=data["region"],
                crdb_region=get_gateway_region()
            )
            db.add(user)
            db.commit()
            return jsonify({"id": str(user.id), "crdb_region": user.crdb_region}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/products", methods=["GET"])
def get_products():
    with SessionLocal() as db:
        products = db.query(Product).all()
        return jsonify([
            {"id": str(p.id), "name": p.name, "price": float(p.price), "stock": p.stock}
            for p in products
        ])

@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.json
    try:
        validate_product_data(data)
        with SessionLocal() as db:
            product = Product(
                name=data["name"],
                price=data["price"],
                stock=data["stock"]
            )
            db.add(product)
            db.commit()
            return jsonify({"id": str(product.id)})
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders", methods=["POST"])
def place_order():
    data = request.json
    try:
        validate_order_data(data)
        with SessionLocal() as db:
            product = db.query(Product).filter(Product.id == uuid.UUID(data["product_id"])).first()
            if not product or product.stock < data["quantity"]:
                return jsonify({"error": "Insufficient stock"}), 400

            product.stock -= data["quantity"]

            order = Order(
                user_id=uuid.UUID(data["user_id"]),
                product_id=uuid.UUID(data["product_id"]),
                quantity=data["quantity"]
            )
            db.add(order)
            db.commit()
            return jsonify({"id": str(order.id)})
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/product-stock", methods=["GET"])
def product_stock_by_region():
    with SessionLocal() as db:
        results = (
            db.query(User.crdb_region, Product.name, func.sum(Order.quantity).label("total"))
            .join(Order, User.id == Order.user_id)
            .join(Product, Product.id == Order.product_id)
            .group_by(User.crdb_region, Product.name)
            .all()
        )
        grouped = defaultdict(list)
        for region, product, total in results:
            grouped[region].append({"product": product, "quantity": int(total)})
        return jsonify(grouped)

@app.route("/stock-by-region", methods=["GET"])
def stock_by_region():
    with SessionLocal() as db:
        users = db.query(User).options(joinedload(User.orders).joinedload(Order.product)).all()
        region_stock = defaultdict(lambda: defaultdict(int))
        for user in users:
            for order in user.orders:
                if order.product:
                    region_stock[user.crdb_region][order.product.name] += order.quantity
        return jsonify([
            {"region": region, "stock_by_product": dict(products)}
            for region, products in region_stock.items()
        ])

# --------------------- Entry Point --------------------- #
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

