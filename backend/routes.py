from flask import Blueprint, request, jsonify
from models import db, Orders, Inventory

api = Blueprint('api', __name__)

# ---------- HEALTH ENDPOINTS ----------

@api.route('/api/healthz')
def health():
    return {"message": "alive"}

@api.route('/api/readyz')
def ready():
    return {"message": "ready"}

@api.route('/')
def root():
    return {"message": "Manufacturing API Backend", "status": "running"}

# ---------- SUMMARY ENDPOINT ----------

@api.route('/api/summary', methods=['GET'])
def get_summary():
    total_orders = Orders.query.count()
    pending_orders = Orders.query.filter_by(status='pending').count()
    
    # Count low stock items
    low_stock_items = 0
    all_items = Inventory.query.all()
    for item in all_items:
        if item.stock_qty < item.min_threshold:
            low_stock_items += 1
    
    return jsonify({
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "low_stock_items": low_stock_items
    })

# ---------- ORDERS ----------

@api.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Orders.query.all()
    return jsonify([{
        "id": o.id,
        "product_name": o.product_name,
        "quantity": o.quantity,
        "status": o.status,
        "created_at": o.created_at.isoformat() if o.created_at else None
    } for o in orders])


@api.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json

    order = Orders(
        product_name=data['product_name'],
        quantity=data['quantity'],
        status="pending"
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({
        "id": order.id,
        "product_name": order.product_name,
        "quantity": order.quantity,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None
    }), 201


@api.route('/api/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = Orders.query.get(id)
    
    if not order:
        return {"error": "Order not found"}, 404

    data = request.json
    if 'status' in data:
        order.status = data['status']
    if 'product_name' in data:
        order.product_name = data['product_name']
    if 'quantity' in data:
        order.quantity = data['quantity']

    db.session.commit()

    return jsonify({
        "id": order.id,
        "product_name": order.product_name,
        "quantity": order.quantity,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None
    })


@api.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Orders.query.get(id)
    
    if not order:
        return {"error": "Order not found"}, 404

    db.session.delete(order)
    db.session.commit()

    return {"message": "order deleted"}

# ---------- INVENTORY ----------

@api.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()

    return jsonify([{
        "id": i.id,
        "item_name": i.item_name,
        "stock_qty": i.stock_qty,
        "min_threshold": i.min_threshold,
        "updated_at": i.updated_at.isoformat() if i.updated_at else None
    } for i in items])


@api.route('/api/inventory', methods=['POST'])
def create_inventory():
    data = request.json

    item = Inventory(
        item_name=data['item_name'],
        stock_qty=data['stock_qty'],
        min_threshold=data.get('min_threshold', 0)
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "id": item.id,
        "item_name": item.item_name,
        "stock_qty": item.stock_qty,
        "min_threshold": item.min_threshold,
        "updated_at": item.updated_at.isoformat() if item.updated_at else None
    }), 201


@api.route('/api/inventory/<int:id>', methods=['PUT'])
def update_inventory(id):
    item = Inventory.query.get(id)
    
    if not item:
        return {"error": "Inventory item not found"}, 404

    data = request.json
    if 'stock_qty' in data:
        item.stock_qty = data['stock_qty']
    if 'min_threshold' in data:
        item.min_threshold = data['min_threshold']
    if 'item_name' in data:
        item.item_name = data['item_name']

    db.session.commit()

    return jsonify({
        "id": item.id,
        "item_name": item.item_name,
        "stock_qty": item.stock_qty,
        "min_threshold": item.min_threshold,
        "updated_at": item.updated_at.isoformat() if item.updated_at else None
    })


@api.route('/api/inventory/<int:id>', methods=['DELETE'])
def delete_inventory(id):
    item = Inventory.query.get(id)
    
    if not item:
        return {"error": "Inventory item not found"}, 404

    db.session.delete(item)
    db.session.commit()

    return {"message": "inventory item deleted"}
