from apscheduler.schedulers.background import BackgroundScheduler
from main import update_all

scheduler = BackgroundScheduler()

scheduler.add_job(update_all, 'interval', seconds=10)

scheduler.start()
