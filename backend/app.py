from flask_cors import CORS
from flask import Flask
from flask import render_template
from flask import send_from_directory
import os


BASEDIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(
    __name__, static_folder="static", static_url_path="/static"
)  # Flaskアプリケーションのインスタンスを作成


CORS(
    app,
    resources={
        r"/api/*": {"origins": "http://localhost:5173"},
        r"/admin/*": {"origins": "http://localhost:5173"},
    },
    supports_credentials=False,
)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{os.path.join(BASEDIR, 'recipes.db')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db_path = os.path.join(BASEDIR, "recipes.db")
print("FLASK_APP FILE :", __file__)
print("CWD           :", os.getcwd())
print("DB PATH       :", db_path)
print("EXISTS BEFORE :", os.path.exists(db_path))

print("EXISTS AFTER  :", os.path.exists(db_path))


@app.route("/")  # ルートURL（ホーム）にアクセスしたときの処理
def home():
    return render_template("index.html", recipes=[])


@app.route("/static/images/<path:filename>")
def serve_image(filename):
    return send_from_directory("static/images", filename)


from routes.login_routes import login_bp

app.register_blueprint(login_bp)

from routes.recipe_search import search_bp

app.register_blueprint(search_bp)

from routes.detail_recipe import detail_bp

app.register_blueprint(detail_bp)

from extensions import db, bcrypt

db.init_app(app)
bcrypt.init_app(app)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
