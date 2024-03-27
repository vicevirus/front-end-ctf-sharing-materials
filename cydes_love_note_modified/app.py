from flask import Flask, request, render_template, redirect, url_for, flash, g, session, send_file, render_template_string
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os
import sqlite3
import uuid
import re
import random
import requests
import string
from bot import visit_url

## This is actually CYDES 2023 Challenge, in which I modified it a little bit.

app = Flask(__name__)
app.secret_key = os.urandom(24)
DATABASE = './loveletter.db'

def generate_random_percentage():
    percentage = random.randint(0, 100)
    return percentage

def extract_lover(letters):
    temp=letters.splitlines()[0]
    if temp.split(" ")[0] == "Dear" and temp[-1] == ",":
        lover = temp.split(" ")[1][:-1]
        if " " in lover:
            return None
        return lover
    return None

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/result/<uid>', methods=['GET','POST'])
def result(uid):
    if request.method == 'GET':
        conn = get_db()
        c = conn.cursor()
        c.execute(f"SELECT letters,result,lover FROM loveletter WHERE uid=?", (uid,))
        conn.commit()
        inputs = c.fetchone()
        if inputs:
            return render_template('result_letter.html',variables=inputs)
        else:
            return [f"Cannot find the exact uid {uid}"]
    # Remark: Delete this since our AI good already. Delete any manual function!
    elif request.method == 'POST' and (request.remote_addr == "127.0.0.1"):
        if request.form['result']:
            result = request.form['result']
            conn = get_db()
            c = conn.cursor()
            c.execute(f"UPDATE loveletter SET result=? WHERE uid=?", (result,uid))
            conn.commit()
            return redirect(url_for('index'))


@app.route('/raw/<uid>', methods=['GET'])
def raw_result(uid):
    conn = get_db()
    c = conn.cursor()
    c.execute(f"SELECT letters,result,lover FROM loveletter WHERE uid=?", (uid,))
    conn.commit()
    inputs = c.fetchone()
    if inputs:
        return '\n'.join(inputs[0].split('\n'))
    else:
        return [f"Cannot find the exact uid {uid}"]

@app.route('/', methods=['GET','POST'])
def index():
    if request.method == 'GET':
        return render_template('home.html')
    elif request.method == 'POST':
        if request.form['type'] == "letters":
            if request.form['inputs']:
                inputs = request.form['inputs']
                result = str(generate_random_percentage())
                conn = get_db()
                c = conn.cursor()
                unique_id = str(uuid.uuid4())
                if inputs:
                    # Add newlines in first 4 characters
                    lover = extract_lover(inputs)
                    if lover:
                        c.execute(f"INSERT INTO loveletter (letters, uid, result, lover) VALUES (?,?,?,?)", (inputs,unique_id,result,lover))
                        conn.commit()
                        flash(f"Here your Letter's UID: {unique_id}")
                    flash("Invalid letter format!")
                flash("Please submit your letter!")
                return redirect(url_for('index'))
        elif request.form['type'] == "uid":
            if request.form['uid']:
                uid = request.form['uid']
                conn = get_db()
                c = conn.cursor()
                c.execute(f"SELECT letters,result,lover FROM loveletter WHERE uid=?", (uid,))
                conn.commit()
                rows = c.fetchone()
                if rows:
                    TARGETS=f"http://127.0.0.1:8376/result/{uid}"
                    visit_url(TARGETS)
                    flash(f"Visit /result/{uid} to view your letter's result!")
                else:
                    flash(f"Cannot find UID : {uid}!")
                return redirect(url_for('index'))


def init_db():
    with app.app_context():
        db = get_db()
        c = db.cursor()
        c.execute("CREATE TABLE IF NOT EXISTS loveletter (letters text, uid text, result text, lover text)")
        db.commit()
    

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, host="0.0.0.0", port=8376)