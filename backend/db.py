from secrets import token_urlsafe
from hashlib import sha256
from pymongo import MongoClient


class saletrackerdb:
    KEY_LENGTH = 16

    def __init__(self):
        self.VENDORS = ["woolworths"]
        self.client = MongoClient()
        self.db = self.client.saletracker

    def get_user(self, user_id):
        return self.db.users.find_one({"id": user_id})

    def get_from_key(self, key):
        user_id = self.db.keys.find_one({"key": key})
        return user_id

    def create_key(self, user_id):
        key = token_urlsafe(self.KEY_LENGTH)
        while self.db.keys.find({"key": key}):
            key = token_urlsafe(self.KEY_LENGTH)

        encrypted_key = sha256(key).hexdigest()
        self.db.keys.insert_one(
            {
                "key": encrypted_key,
                "user_id": user_id
            }
        )

    def create_user(self, user_id):
        if self.get_user(user_id) is None:
            self.db.users.insert_one(
                {
                    "id": user_id,
                    "products": {}
                }
            )
            return True
        else:
            return False

    def link_product(self, user_id, vendor_name, product_id):
        vendor_names = self.db.users.find_one({'id': user_id})['products']
        if vendor_name not in vendor_names:
            vendor_names[vendor_name] = {}
        if product_id not in vendor_names[vendor_name]:
            vendor_names[vendor_name][product_id] = ''
            self.db.users.update_one({'id': user_id}, {'$set': {'products': vendor_names}})
            return True
        else:
            return False


    def add_vendor(self, vendor_name):
        if self.get_vendor(vendor_name) is not None:
            return False
        self.db.products.insert_one(
            {
                "vendor_name": vendor_name,
                "products": {}
            }
        )
        return True

    def add_product(self, vendor_name, product_id, product_name, product_desc=None):
        vendor = self.get_vendor(vendor_name)
        product = vendor['products'].get(product_id)
        if not product:
            vendor['products'][product_id] = {
                "name": product_name,
                "description": product_desc,
                "prices": {}
            }
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': vendor['products']}})
            return True
        else:
            return False


    def add_price(self, vendor_name, product_id, timestamp, price):
        vendor = self.get_vendor(vendor_name)
        products = vendor['products']
        if products.get(product_id):
            products[product_id]['prices'][str(timestamp)] = str(price)
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': products}})
        else:
            return False

    def get_vendor(self, vendor_name):
        return self.db.products.find_one({"vendor_name": vendor_name})

    def get_all_vendors(self):
        return self.db.products.find()

    def get_product_info(self, vendor_name, product_id):
        vendor = self.db.products.find_one({"vendor_name": vendor_name})
        if vendor:
            product = vendor["products"].get(product_id)
            if product:
                return product

        return False

    def remove_product(self, vendor_name, product_id):
        products = self.get_vendor(vendor_name)["products"]
        if product_id in products:
            products.pop(product_id)
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': products}})
            return True
        else:
            return False
