from flask import Flask, request, jsonify
from models import User, Product, Order
from db import SessionLocal
import uuid

app = Flask(__name__)

@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.json
    db = SessionLocal()
    try:
        user = User(
            name=data["name"],
            email=data["email"],
            region=data["region"]
        )
        db.add(user)
        db.commit()
        return jsonify({"id": str(user.id)})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
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
    app.run(debug=True)