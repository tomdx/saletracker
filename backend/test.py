from db import saletrackerdb
from scraper import Scraper


s = saletrackerdb()

Sc = Scraper('woolworths')

print(s.get_prices('woolworths', '250016'))
