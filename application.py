import os

from flask import Flask, render_template, redirect, url_for, jsonify, request

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

usernames = []
message_id = [0]


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
	return render_template("home.html")