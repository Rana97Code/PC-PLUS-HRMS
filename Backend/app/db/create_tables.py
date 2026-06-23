
from app.db.database import engine, Base

# import all models
from app.models.user_model import User

Base.metadata.create_all(bind=engine)

print("Tables created successfully")