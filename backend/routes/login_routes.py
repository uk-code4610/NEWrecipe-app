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
    if not username or not password:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "ユーザー名とパスワードを入力してください",
                }
            ),
            400,
        )
    if len(username) < 4:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "ユーザー名は4文字以上である必要があります",
                }
            ),
            400,
        )
    if len(password) < 6:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "パスワードは6文字以上である必要があります",
                }
            ),
            400,
        )
    existing_user = User.query.filter_by(username=username).first()
    if existing_user is not None:
        return (
            jsonify({"status": "error", "message": "ユーザー名は既に存在します"}),
            400,
        )
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"status": "success", "message": "ユーザー登録が完了しました"}), 201


@login_bp.route("/api/login", methods=["POST"])
@cross_origin()
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "ユーザー名とパスワードを入力してください",
                }
            ),
            400,
        )
    user = User.query.filter_by(username=username).first()
    if user is None or not bcrypt.check_password_hash(user.password_hash, password):
        return (
            jsonify({"status": "error", "message": "無効なユーザー名またはパスワード"}),
            401,
        )
    return jsonify({"status": "success", "message": "ログインに成功しました"}), 200
