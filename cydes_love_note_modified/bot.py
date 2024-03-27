from selenium import webdriver
from time import sleep

#!/usr/bin/python3


def visit_url(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')
    options.add_argument('ignore-certificate-errors')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)
    try:
        
        # Sets the flag to the cookie
        driver.get('http://127.0.0.1:8376/')
        cookie = {'name': 'flag', 'value': 'lvlup{test_flag}', 'domain': '127.0.0.1', 'path': '/'}
        driver.add_cookie(cookie)
        
        # Visits your note/payload
        driver.get(url)
        

    except Exception as e:
        print(e)
    finally:
        driver.quit()
