from registros import app
from flask import jsonify,render_template,request
from registros.models import *
from config import *
import sqlite3
from http import HTTPStatus

@app.route("/")
def index():
    return render_template("index.html")

@app.route(f"/api/{VERSION}/all")
def all_movements():

    try:
        registros = select_all()
        return jsonify(
        {
            "data":registros,
            "status":"OK"
        }
        ),HTTPStatus.OK

    except sqlite3.Error as ex:
        return jsonify(
        {
            "data":str(ex),
            "status":"Error"
        }
        ),HTTPStatus.BAD_REQUEST

           
    
   

@app.route(f"/api/{VERSION}/detail/<int:id>")
def select_by_id(id):
    try:
        registros= select_by(id)
        return jsonify(
        {
            "data":registros,
            "status":"OK"
        }
        ),HTTPStatus.OK

    except sqlite3.Error as ex:
        return jsonify(
        {
            "data":str(ex),
            "status":"Error"
        }
        ),HTTPStatus.BAD_REQUEST


@app.route(f"/api/{VERSION}/new", methods=["POST"])
def create():
     datos = request.json#capturo el json recibido en la peticion
     try:
        insert([datos['date'],datos['concept'],datos['quantity']])
        return jsonify(
        {
            "status":"OK"
        }
        ),HTTPStatus.CREATED

     except sqlite3.Error as ex:
        return jsonify(
        {
            "data":str(ex),
            "status":"Error"
        }
        ),HTTPStatus.BAD_REQUEST

@app.route(f"/api/{VERSION}/update/<int:id>",methods=["PUT"])
def update(id):
    datos = request.json#capturo el json recibido en la peticion
    try:
        update_by(id, [datos['date'],datos['concept'],datos['quantity']] )
        return jsonify(
        {
            "status":"OK"
        }
        ),HTTPStatus.OK

    except sqlite3.Error as ex:
        return jsonify(
        {
            "data":str(ex),
            "status":"Error"
        }
        ),HTTPStatus.BAD_REQUEST

@app.route(f"/api/{VERSION}/delete/<int:id>",methods=["DELETE"])
def remove(id):
    try:
        #para controlar si existe el id
        lista=select_by(id)
        if lista:
            delete_by(id )
            return jsonify(
            {
                "status":"OK"
            }
            ),HTTPStatus.OK
        else:
            return jsonify(
            {
                "data":f"No existe el registro con el id:{id}",
                "status":"Error"
            })


    except sqlite3.Error as ex:
        return jsonify(
        {
            "data":str(ex),
            "status":"Error"
        }
        ),HTTPStatus.BAD_REQUEST