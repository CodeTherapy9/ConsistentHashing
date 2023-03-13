import requests
import json
import uuid

import string
import random

def rand_gen(N = 7):
    my_rand_int = 0
    res = []
    res.append(''.join(random.choices(string.ascii_letters, k=N)))
    res.append(''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=N)))
    res.append(''.join(random.choices(string.ascii_lowercase +
                             string.digits, k=N)))
    my_random_float = random.random()
    if my_random_float > .333:
        my_rand_int = 1
    elif my_random_float >0.66:
        my_rand_int = 2
    else:
        my_rand_int = 0
    
    return res[my_rand_int] 

from concurrent.futures import ThreadPoolExecutor, as_completed

errors = []
def get_data(api_url, headers = {}):
        response = requests.get(api_url, headers = headers)
        try:
            if response.status_code >= 200 and response.status_code < 400:
                print("sucessfully fetched the data")
                print(response.json())
            else:
                print(f"STATUS CODE: {response.status_code}, error")
                print(response.json())
        except:
            print(':")')


url = "http://localhost:6969/consistent-hash/"

def runner():
    threads= []
    with ThreadPoolExecutor(max_workers = 16) as executor:
        cnt = 0
        for i in range(1, 100000):
            ranStr = rand_gen()
            print(f'Running res: {ranStr}\n')
            api_url = url + ranStr
            threads.append(executor.submit(get_data, api_url))
            
        for task in as_completed(threads):
            cnt+=1
            print(cnt)

       
runner()