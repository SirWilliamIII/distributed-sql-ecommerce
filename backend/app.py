from flask import Flask, request, jsonify
from models import User, Product, Order
from db import SessionLocal, get_gateway_region
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {
    "origins": ["http://localhost:5173", "http://127.0.0.1:5173"]
}})

@app.route("/users", methods=["GET"])
def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    return jsonify([
        {
            "id": str(u.id),
            "name": u.name,
            "email": u.email,
            "region": u.region,
            "crdb_region": u.crdb_region
        }
        for u in users
    ])

@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.json
    db = SessionLocal()
    try:
        user = User(
            id=uuid.uuid4(),
            name=data["name"],
            email=data["email"],
            region=data["region"],
            crdb_region=get_gateway_region()
        )
        db.add(user)
        db.commit()
        return jsonify({"message": "User created: " + str(user.id)}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@app.route("/products", methods=["GET"])
def get_products():
    db = SessionLocal()
    try:
        products = db.query(Product).all()
        return jsonify([
            {
                "id": str(p.id),
                "name": p.name,
                "price": float(p.price),
                "stock": p.stock
            }
            for p in products
        ])
    finally:
        db.close()


@app.route("/create-product", methods=["POST"])
def create_product():
    data = request.json
    db = SessionLocal()
    try:
        product = Product(
            name=data["name"],
            price=data["price"],
            stock=data["stock"]
        )
        db.add(product)
        db.commit()
        return jsonify({"id": str(product.id)})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@app.route("/place-order", methods=["POST"])
def place_order():
    data = request.json
    db = SessionLocal()
    try:
        product = db.query(Product).filter(
            Product.id == uuid.UUID(data["product_id"])).first()
        if not product or product.stock < data["quantity"]:
            return jsonify({"error": "Insufficient stock"}), 400

        # Decrease stock
        product.stock -= data["quantity"]

        order = Order(
            user_id=uuid.UUID(data["user_id"]),
            product_id=uuid.UUID(data["product_id"]),
            quantity=data["quantity"]
        )
        db.add(order)
        db.commit()
        return jsonify({"id": str(order.id)})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)