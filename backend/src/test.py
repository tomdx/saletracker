import scraper
price = scraper.get_info(vendor_name='woolworths', product_id='133211')['price']
print(price)