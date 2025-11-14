from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from extensions import db, bcrypt
from models import User

login_bp = Blueprint("login_bp", __name__)


@login_bp.route("/api/register", methods=["POST"])
@cross_origin()
def register():
    username = request.json.get("username")
    password = request.json.get("password")
    existing_user = User.query.filter_by(username=username).first()
    if existing_user is not None:
        return jsonify({"status": "error", "message": "ユーザー名は既に存在します"})
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"status": "success", "message": "ユーザー登録が完了しました"})


@login_bp.route("/api/login", methods=["POST"])
@cross_origin()
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.query.filter_by(username=username).first()
    if user is None or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify(
            {"status": "error", "message": "無効なユーザー名またはパスワード"}
        )
    return jsonify({"status": "success", "message": "ログインに成功しました"})
