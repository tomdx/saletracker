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
def update_all():
    for vendor in db.get_all_vendors():
        vendor_name = vendor['vendor_name']
        s = Scraper(vendor_name)
        for product_id in vendor['products']:
            prices = s.get_price(product_id)
            db.add_price(vendor_name, product_id, time(), prices['actual_price'])
    return {}

@f.route('/api/getprice', methods=['GET'])
def get_prices():
    args = flask.request.args
    return db.get_prices(args.get('vendor_name'), args.get('product_id'))




f.run()
