from datetime import datetime
from extensions import db


class Recipe(db.Model):  # SQLAlchemyのモデルクラスを定義
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    ingredients = db.Column(db.PickleType, nullable=False)
    steps = db.Column(db.PickleType, nullable=False)
    time_min = db.Column(db.Integer, nullable=True)

    def __repr__(self):  # debug用
        return f"<Recipe {self.title}>"


class User(db.Model):  # ログインモデル定義
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def __repr__(self):
    return f"<User {self.username}>"
