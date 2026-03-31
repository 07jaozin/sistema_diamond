#import os
#from rq import Queue
#from redis import Redis
#
#redis_host = os.getenv("REDIS_HOST", "localhost")
#
#redis_conn = Redis(host=redis_host, port=6379)
#
#fila_eventos = Queue("os_eventos", connection=redis_conn)