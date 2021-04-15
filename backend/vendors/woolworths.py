import requests
from vendors.vendor import Vendor
import datetime
import re

class Woolworths(Vendor):

    def parse_url(self, url):
        id = re.search(pattern="\d{6}", string=url).group()
        return id

    def get_price(self, product_id):
        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{product_id}?isMobile=false").json()
        return r['Product']['Price']

    def get_name(self, product_id):
        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{product_id}?isMobile=false").json()
        return r['Product']['Name']

    def get_desc(self, product_id):
        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{product_id}?isMobile=false").json()
        return r['Product']['Description']


