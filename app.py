"""Flask app for Cupcakes"""

from flask import Flask, render_template, redirect, flash, jsonify, request

# import requests

from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///cupcakes"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

connect_db(app)
db.create_all()

toolbar = DebugToolbarExtension(app)

@app.route("/")
def root():
    """Homepage"""

    return render_template("index.html")
    

@app.route("/api/cupcakes")
def list_cupcakes():
    """Show all cupcakes"""

    search_term = request.args.get('searchTerm')

    if search_term:
        cupcakes = Cupcake.query.filter(Cupcake.flavor.ilike(f"%{search_term}%")).all()
    else:
        cupcakes = Cupcake.query.all()
    
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)


@app.route("/api/cupcakes/<int:cupcake_id>")
def show_cupcake(cupcake_id):
    """Show ONE cupcake"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()
    return jsonify(cupcake=serialized)


@app.route("/api/cupcakes", methods=["POST"])
def add_cupcake():
    """Add a cupcake"""

    data = request.json

    cupcake = Cupcake(
        flavor=data.get("flavor"),
        size=data.get("size"),
        rating=data.get("rating"),
        image=data.get("image") or None
    )

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()), 201)


@app.route("/api/cupcakes/<int:cupcake_id>", methods=["PATCH"])
def update_cupcake(cupcake_id):
    """Update a cupcake"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    data = request.json
    cupcake.flavor = data.get("flavor")
    cupcake.size = data.get("size")
    cupcake.rating = data.get("rating")
    cupcake.image = data.get("image") or None

    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()))


@app.route('/api/cupcakes/<int:cupcake_id>', methods=["DELETE"])
def delete_cupcake(cupcake_id):
    """Delete a cupcake"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)

    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message="Deleted")
