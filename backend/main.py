import flask
import scraper
import flask_login

from flask_login import LoginManager
from flask_cors import CORS
from time import time

from db import Saletrackerdb
from user.user_manager import UserManager
from user.user import User

with open('credentials.txt') as credentials:
    username = credentials.readline().strip()
    password = credentials.readline().strip()

db = Saletrackerdb(username, password)
app = flask.Flask(__name__)

user_manager = UserManager()
login_manager = LoginManager()
login_manager.init_app(app)
app.config['CORS_HEADERS'] = 'Content-Type'

with open('flask_secret_key.txt') as key:
    app.secret_key = key.readline().strip()

app.config["DEBUG"] = True

CORS(app, supports_credentials=True)

@login_manager.user_loader
def load_user(user_id):
    return user_manager.get_user(user_id)


@app.route('/', methods=['GET'])
def home():
    return "Home"


@app.route('/api/update-all', methods=['GET'])
def update_all():
    for vendor in db.get_all_vendors():
        vendor_name = vendor['vendor_name']
        for product_id in vendor['products']:
            price = scraper.get_info(vendor_name=vendor_name, product_id=product_id)['price']
            db.add_price(vendor_name, product_id, time(), price)
    return {}


@app.route('/api/unlink-product', methods=['GET'])
def unlink_product():
    args = flask.request.args
    vendor_name = args.get('vendor_name')
    product_id = args.get('product_id')
    user_id = db.get_user(flask_login.current_user.get_id())
    db.unlink_product(user_id, vendor_name, product_id)
    return {}


@app.route('/api/get-all-prices', methods=['GET'])
@flask_login.login_required
def get_all_prices():
    user = db.get_user(flask_login.current_user.get_id())
    result = {}
    for vendor_name in user['products']:
        result[vendor_name] = {}
        for product_id in user['products'][vendor_name]:
            product_info = db.get_product_info(vendor_name, product_id)
            result[vendor_name][product_id] = product_info

    return result


@app.route('/api/add-from-url', methods=['GET'])
@flask_login.login_required
def add_from_url():

    # Parse args
    args = flask.request.args
    user_id = flask_login.current_user.get_id()
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


@app.route('/signup', methods=['POST'])
def signup():
    form = flask.request.form
    db.create_user(form['username'], form['password'])
    return {}



@app.route('/login', methods=['POST'])
def login():
    form = flask.request.form
    print(form)
    if not form:
        return {}
    username = form['username']
    password = form['password']
    if db.verify_user(username, password):
        user_manager.store_user(User(username))
        flask_login.login_user(user_manager.get_user(username))
        next = flask.request.args.get('next')

        if not is_safe_url(next):
            return flask.abort(400)
        return flask.redirect('http://localhost:5000/')
    return {}


def is_safe_url(url):
    return True

app.run()
