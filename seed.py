from app import app
from models import db, Cupcake, Ingredient

db.drop_all()
db.create_all()

c1 = Cupcake(
    flavor="cherry",
    size="large",
    rating=5,
)

c2 = Cupcake(
    flavor="chocolate",
    size="small",
    rating=9,
    image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg"
)

i1 = Ingredient(
    name="sugar"
)

i2 = Ingredient(
    name="chocolate"
)

db.session.add_all([c1, c2, i1, i2])
db.session.commit()
