from pymongo import MongoClient
import bcrypt

class Saletrackerdb:

    def __init__(self, username, password):
        self.client = MongoClient(f"mongodb+srv://{username}:{password}@saletracker.jkwzr.mongodb.net/saletracker?retryWrites=true&w=majority")
        db = self.client.test
        self.db = self.client.saletracker

    def get_user(self, user_id):
        return self.db.users.find_one({"id": user_id})

    def get_credentials(self, user_id: str):
        return self.db.credentials.find_one({"id": user_id})

    def verify_user(self, user_id, password):
        credentials = self.get_credentials(user_id)
        if not credentials:
            return False

        password = password.encode('utf-8')
        return bcrypt.hashpw(password, credentials['salt']) == credentials['hashed']


    def create_user(self, user_id, password):
        password = password.encode('utf-8')
        if self.get_credentials(user_id) is None:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password, salt)
            self.db.credentials.insert_one(
                {
                    "id": user_id,
                    "hashed": hashed,
                    "salt": salt,
                }
            )
            self.db.users.insert_one(
                {
                    "id": user_id,
                    "products": {}
                }
            )
            return True
        else:
            return False

    def link_product(self, user_id: str, vendor_name: str, product_id: str, timestamp: float, initial_price: float, product_info: dict):
        if not self.get_product_info(vendor_name, product_id):
            self.add_product(vendor_name, product_id, timestamp, initial_price, product_info)
        print(user_id)
        vendor_names = self.get_user(user_id)['products']
        if vendor_name not in vendor_names:
            vendor_names[vendor_name] = {}
        if product_id not in vendor_names[vendor_name]:
            vendor_names[vendor_name][product_id] = ''
            self.db.users.update_one({'id': user_id}, {'$set': {'products': vendor_names}})
            return True
        else:
            return False

    def unlink_product(self, user_id, vendor_name, product_id):
        vendor_names = self.db.users.find_one({'id': user_id})['products']
        if vendor_name not in vendor_names:
            return False
        elif product_id in vendor_names[vendor_name]:
            vendor_names[vendor_name].pop(product_id)
            self.db.users.update_one({'id': user_id}, {'$set': {'products': vendor_names}})
            return True
        else:
            return False

    def add_vendor(self, vendor_name):
        if self.get_vendor(vendor_name) is not None:
            return None

        vendor = {
            "vendor_name": vendor_name,
            "products": {}
        }
        self.db.products.insert_one(vendor)

        return vendor

    def add_product(self, vendor_name: str, product_id: str, timestamp: float, initial_price: float, product_info: dict):
        vendor = self.get_vendor(vendor_name)
        if not vendor:
            vendor = self.add_vendor(vendor_name)

        product = vendor['products'].get(product_id)
        if not product:
            vendor['products'][product_id] = {
                'info': product_info,
                'prices': []
            }
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': vendor['products']}})
            self.add_price(vendor_name, product_id, timestamp, initial_price)
            return True
        else:
            return False

    def add_price(self, vendor_name: str, product_id: str, timestamp: float, price: float) -> bool:
        vendor = self.get_vendor(vendor_name)
        products = vendor['products']
        if products.get(product_id):
            if len(products[product_id]['prices']) != 0:
                last_time, last_price = products[product_id]['prices'][-1]
                if last_price == price:
                    return True

            products[product_id]['prices'].append([str(timestamp), str(price)])
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': products}})
            return True
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
        return None

    def remove_product(self, vendor_name, product_id):
        products = self.get_vendor(vendor_name)["products"]
        if product_id in products:
            products.pop(product_id)
            self.db.products.update_one({"vendor_name": vendor_name}, {"$set": {'products': products}})
            return True
        else:
            return False
