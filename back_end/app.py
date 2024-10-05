from flask import Flask, request

app = Flask(__name__)


@app.route("/hello_world", methods=['GET'])
def hello_world():
    return {"response": "Hello world!"}
