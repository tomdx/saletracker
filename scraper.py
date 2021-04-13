from vendors.woolworths import Woolworths
from exceptions.InvalidVendorException import InvalidVendorException
from exceptions.InvalidPriceOutputException import InvalidPriceOutputException
import time

class Scraper:

    def __init__(self, vendor):
        if vendor == "woolworths":
            self.vendor = Woolworths()


    def get_price(self, product_id):
        return self.vendor.get_price(product_id)