from vendors.woolworths import Woolworths
from exceptions.InvalidVendorException import InvalidVendorException
from exceptions.InvalidPriceOutputException import InvalidPriceOutputException
import time

class Scraper:

    def __init__(self, vendor):
        if vendor == "woolworths":
            self.vendor = Woolworths()