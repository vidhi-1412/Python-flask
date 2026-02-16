from app import app
from models import db, Orders, Inventory

app.app_context().push()
db.create_all()

# Add sample inventory data
inventory_data = [
    {"item_name": "Laptop", "stock_qty": 20, "min_threshold": 5},
    {"item_name": "Mobile Phone", "stock_qty": 50, "min_threshold": 10},
    {"item_name": "Headphones", "stock_qty": 100, "min_threshold": 20},
    {"item_name": "Keyboard", "stock_qty": 40, "min_threshold": 10},
    {"item_name": "Mouse", "stock_qty": 60, "min_threshold": 15},
]

# Add sample orders data
orders_data = [
    {"product_name": "Laptop", "quantity": 2, "status": "pending"},
    {"product_name": "Mobile Phone", "quantity": 1, "status": "completed"},
    {"product_name": "Headphones", "quantity": 3, "status": "processing"},
    {"product_name": "Keyboard", "quantity": 5, "status": "pending"},
    {"product_name": "Mouse", "quantity": 4, "status": "cancelled"},
]

# Clear existing data
db.session.query(Inventory).delete()
db.session.query(Orders).delete()
db.session.commit()

# Add inventory
for item in inventory_data:
    inv = Inventory(**item)
    db.session.add(inv)

# Add orders
for order in orders_data:
    ord = Orders(**order)
    db.session.add(ord)

db.session.commit()
print("Database seeded successfully!")
