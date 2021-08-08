from apscheduler.schedulers.background import BackgroundScheduler


def create_price_scheduler(update_all):
    scheduler = BackgroundScheduler()
    #scheduler.add_job(update_all, 'interval', seconds=10)
    #scheduler.add_job(update_all, 'cron', hour=12)
    scheduler.start()