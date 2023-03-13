import json
import random
import time
from datetime import datetime,timedelta
from flask import Flask, Response, render_template, stream_with_context,g
from mysql.connector import pooling


random.seed()  # Initialize the random number generator
map_dic={
    "http://api_node_1:3000":0,
    "http://api_node_2:3000":1,
    "http://api_node_3:3000":2,
    "http://api_node_4:3000":3

    }

def get_db():
    print ('GETTING CONN')
    if 'db' not in g:
        g.db = app.config['MySQL_pool'].get_connection()
    return g.db

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('settings.py')
    
    # print(os.environ.get("DB_PORT"))
    # app.config['postgreSQL_pool'] = pool.SimpleConnectionPool(1, 20,user = "notty",
    #                                               password = "12345678",
    #                                               host = "127.0.0.1",
    #                                               port = "5432",
    #                                               database = "node_db")
    app.config['MySQL_pool'] = pooling.MySQLConnectionPool(pool_name="flask_pool",pool_size=10,
                                                  pool_reset_session=True,
                                                  host=app.config['DB_HOST'],
                                                  database=app.config['DB_NAME'],
                                                  user=app.config['DB_USER'],
                                                  password=app.config['DB_PASSWORD'],
                                                  port=app.config['DB_PORT'],
                                                  autocommit=True
                                                  )

    # @app.teardown_appcontext
    # def close_conn(e):
    #     print('CLOSING CONN')
    #     db = g.pop('db', None)
    #     # if db is not None:
    #     #     app.config['postgreSQL_pool'].putconn(db)

    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/chart-data')
    def chart_data():
        def generate_random_data():
            while True:
                conn=app.config['MySQL_pool'].get_connection()
                timestamp=datetime.now()#-timedelta(hours=5,minutes=30)
                data_200=[0,0,0,0]
                data_400=[0,0,0,0]
                cursor = conn.cursor()
                cursor.execute(f"select count(rid),status,server from analytics where (timestamp between '{timestamp-timedelta(seconds=10)}' and '{timestamp}'  ) group by server,status;")
                # print(f"select count(rid),status,server from analytics where (timestamp between '{timestamp-timedelta(seconds=10)}' and '{timestamp}'  ) group by server,status;")
                data=cursor.fetchall()
                cursor.close()
                conn.close()
                for row in data:
                    if row[1]==200:
                        data_200[map_dic[row[2]]]=row[0]
                    else:
                        data_400[map_dic[row[2]]]=row[0]
                # print(data,"\n")
                json_data = json.dumps(
                    {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'value': random.random() * 100,
                     'stat_200':data_200,
                     'stat_400':data_400
                     })
                
                # timestamp+=timedelta(seconds=10)
                yield f"data:{json_data}\n\n"
                time.sleep(1)

        response = Response(stream_with_context(generate_random_data()), mimetype="text/event-stream")
        response.headers["Cache-Control"] = "no-cache"
        response.headers["X-Accel-Buffering"] = "no"
        return response

    return app

if __name__ == '__main__':
    app=create_app()
    app.run(debug=True, threaded=True,host="0.0.0.0")
