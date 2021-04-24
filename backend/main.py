import flask
from flask_cors import CORS
from db import saletrackerdb
import scraper
from time import time

db = saletrackerdb()
f = flask.Flask(__name__)
CORS(f)

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
        for product_id in vendor['products']:
            price = scraper.get_info(vendor_name=vendor_name, product_id=product_id)['price']
            db.add_price(vendor_name, product_id, time(), price)
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



@f.route('/api/unlink-product', methods=['GET'])
def unlink_product():
    args = flask.request.args
    vendor_name = args.get('vendor_name')
    product_id = args.get('product_id')
    user_id = args.get('user_id')
    db.unlink_product(user_id, vendor_name, product_id)
    return {}


@f.route('/api/get-all-prices', methods=['GET'])
def get_all_prices():
    args = flask.request.args
    user = db.get_user(args.get('user_id'))
    result = {}
    for vendor_name in user['products']:
        result[vendor_name] = {}
        for product_id in user['products'][vendor_name]:
            product_info = db.get_product_info(vendor_name, product_id)
            result[vendor_name][product_id] = product_info

    return result

@f.route('/api/add-vendor', methods=['GET'])
def add_vendor():
    vendor_name = flask.request.args.get('vendor_name')
    db.add_vendor(vendor_name)
    return {}

@f.route('/api/add-from-url', methods=['GET'])
def add_from_url():

    # Parse args
    args = flask.request.args
    user_id = args.get('user_id')
    url = args.get('url')

    # Scrape info
    info = scraper.get_info(url=url)

    product_id = info['product_id']
    vendor_name = info['vendor_name']
    initial_price = info['price']
    product_info = {
        'name': info['product_name'],
        'desc': info['desc'],
        'img_url': info['img_url']
    }
    result = db.link_product(user_id, vendor_name, product_id, time(), initial_price, product_info)
    return {'success': result}

@f.route('/api/add-user/', methods=['GET'])
def add_user():
    args = flask.request.args
    user_id = args.get('user_id')
    db.create_user(user_id)
    return {}


f.run()
