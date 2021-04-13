import requests
from vendors.vendor import Vendor
import datetime

class Woolworths(Vendor):

    def get_price(self, product_id):
        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{product_id}?isMobile=false").json()
        return {
            "actual_price": r['Product']['Price'],
            "normal_price": r['Product']['WasPrice']
        }


