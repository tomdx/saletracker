import flask
from db import saletrackerdb
from scraper import Scraper
from time import time

db = saletrackerdb()
f = flask.Flask(__name__)

f.config["DEBUG"] = True

@f.route('/', methods=['GET'])
def home():
    return "Home"

@f.route('/api/update', methods=['GET'])
def update():
    args = flask.request.args
    vendor_name = args.get('vendor_name')
    product_id = args.get('product_id')
    s = Scraper(vendor_name)
    price = s.vendor.get_price(product_id)
    db.add_price(vendor_name, product_id, time(), price)
    return {}


@f.route('/api/update-all', methods=['GET'])
def update_all():
    for vendor in db.get_all_vendors():
        vendor_name = vendor['vendor_name']
        s = Scraper(vendor_name)
        for product_id in vendor['products']:
            prices = s.vendor.get_price(product_id)
            db.add_price(vendor_name, product_id, time(), prices['actual_price'])
    return {}


@f.route('/api/getprice', methods=['GET'])
def get_prices():
    args = flask.request.args
    return db.get_product_info(args.get('vendor_name'), args.get('product_id'))['prices']


@f.route('/api/create-user', methods=['GET'])
def create_user():
    user_id = flask.request.args.get('user_id')
    db.create_user(user_id)
    return {}


@f.route('/api/link-product', methods=['GET'])
def link_product():
    args = flask.request.args
    vendor_name = args.get('vendor_name')
    product_id = args.get('product_id')
    user_id = args.get('user_id')
    info = db.get_product_info(vendor_name, product_id)
    if not info:
        s = Scraper(vendor_name)
        db.add_product(vendor_name, product_id, s.vendor.get_name(product_id), s.vendor.get_desc(product_id))
    db.link_product(user_id, vendor_name, product_id)
    return {}


@f.route('/api/get-all-prices', methods=['GET'])
def get_all_prices():
    args = flask.request.args
    user = db.get_user(args.get('user_id'))
    result = {}
    for vendor_name in user['products']:
        for product_id in user['products'][vendor_name]:
            product_info = db.get_product_info(vendor_name, product_id)
            result[product_id] = product_info

    return result

@f.route('/api/add-vendor', methods=['GET'])
def add_vendor():
    vendor_name = flask.request.args.get('vendor_name')
    db.add_vendor(vendor_name)
    return {}

f.run()
