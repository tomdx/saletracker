from db import saletrackerdb
from scraper import Scraper
import requests


r = requests.get('http://localhost:5000/api/add-from-url?user_id=debug&url=https://www.woolworths.com.au/shop/productdetails/829814')

print(r.text)