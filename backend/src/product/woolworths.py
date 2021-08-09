import requests
from product.product import Product
from exceptions import BadArgumentsException
from exceptions import InvalidResponseException


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

        try:
            info_url = f"https://www.woolworths.com.au/api/v3/ui/schemaorg/product/{self.id}"
            user_agent = {'User-agent': 'Mozilla/5.0'}
            r = requests.get(info_url, headers=user_agent)
            r = r.json()
            self.product_name = r['name']
            self.price = r['offers']['price']
            self.desc = r['description']
            self.img_url = r['image']
        except TypeError:
            raise InvalidResponseException


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


