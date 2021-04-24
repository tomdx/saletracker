import requests
from product.product import Product
from exceptions import BadArgumentsException


class WoolworthsProduct(Product):

    @staticmethod
    def __parse_product_id(url):
        index = url.find('productdetails') + len('productdetails') + 1
        end = url.find('/', index + 1)
        return url[index:end]

    def __init__(self, product_id: str=None, url: str=None):
        if product_id:
            self.id = product_id
        elif url:
            self.id = self.__parse_product_id(url)
        else:
            raise BadArgumentsException

        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{self.id}").json()
        self.product_name = r['Product']['Name']
        self.price = r['Product']['Price']
        self.desc = r['Product']['Description']
        self.img_url = r['Product']['SmallImageFile']

    def get_vendor_name(self) -> str:
        return 'woolworths'

    def get_id(self) -> str:
        return self.id

    def get_price(self) -> str:
        return self.price

    def get_name(self) -> str:
        return self.product_name

    def get_desc(self) -> str:
        return self.desc

    def get_img_url(self) -> str:
        return self.img_url


