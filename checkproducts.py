import requests

def check(product_id, store):
    if store == "woolworths":
        r = requests.get(f"https://www.woolworths.com.au/apis/ui/product/detail/{product_id}?isMobile=false").json()
        return (r['Product']['Price'], r['Product']['WasPrice'])

def check_all(idfile):
    with open(idfile) as products:
        for line in products:
            store, product_id = line.strip().split(' ')
            print(check(product_id, store))

check_all("products.txt")
