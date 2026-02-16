from app import app
from models import db, Orders, Inventory

app.app_context().push()

print("=== CURRENT DATABASE STATUS ===\n")

# Check inventory
print("INVENTORY TABLE:")
inventory_items = Inventory.query.all()
print(f"Total items: {len(inventory_items)}")
for item in inventory_items:
    print(f"  - ID {item.id}: {item.item_name} (Stock: {item.stock_qty}, Min: {item.min_threshold})")

print("\nORDERS TABLE:")
orders = Orders.query.all()
print(f"Total orders: {len(orders)}")
for order in orders:
    print(f"  - ID {order.id}: {order.product_name} (Qty: {order.quantity}, Status: {order.status})")

print("\n✅ All data persists in the SQLite database file:")
print("   Location: instance/database.db")
