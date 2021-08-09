from product.woolworths import WoolworthsProduct
from product.coles import ColesProduct
from product.myer import MyerProduct
from exceptions import InvalidProductException, InvalidVendorException, BadArgumentsException

def _parse_vendor(url: str) -> str:
    """
    Give a URL, get a vendor name
    :param url: URL
    :return: vendor name
    """
    if "woolworths" in url:
        return "woolworths"
    elif "coles" in url:
        return "coles"
    else:
        raise InvalidVendorException


def get_info(vendor_name: str=None, product_id: str=None, url: str=None):
    """
    Supply either a vendor name + product ID, or a URL. Returns product information
    :param vendor_name: Vendor name
    :param product_id: Product ID
    :param url: URL
    :return: Product information
    """
    if not vendor_name:
        if url:
            vendor_name = _parse_vendor(url)
        else:
            raise BadArgumentsException

    if vendor_name == 'woolworths':
        product = WoolworthsProduct(product_id=product_id, url=url)
    elif vendor_name == 'coles':
        product = ColesProduct()
    elif vendor_name == 'myer':
        product = MyerProduct()
    else:
        raise InvalidVendorException

    try:
        return {
            'vendor_name': str(vendor_name),
            'product_id': str(product.get_id()),
            'product_name': str(product.get_name()),
            'desc': str(product.get_desc()),
            'price': str(product.get_price()),
            'img_url': str(product.get_img_url()),
        }
    except (ValueError, NotImplementedError):
        raise InvalidProductException









