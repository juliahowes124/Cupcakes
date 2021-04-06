"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)


class Cupcake(db.Model):
    """ Cupcake table """

    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    image = db.Column(db.Text, nullable=False, default="https://tinyurl.com/demo-cupcake")

    ingredients = db.relationship('Ingredient',
                                  secondary="cupcakes_ingredients")

    def serialize(self):
        """Serialize to dictionary."""

        return {
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image,
            "ingredients": [ingredient.name for ingredient in self.ingredients]
        }


class Ingredient(db.Model):
    """ Ingredient Table """

    __tablename__ = "ingredients"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)


class CupcakeIngredient(db.Model):
    """ Cupcake-Ingredient Intermediate Table """

    __tablename__ = "cupcakes_ingredients"

    cupcake_id = db.Column(db.Integer, db.ForeignKey('cupcakes.id'),
                           nullable=False, primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'),
                              nullable=False, primary_key=True)