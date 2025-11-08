from flask_cors import CORS,cross_origin
from flask import Flask,jsonify  
from flask import render_template,request, redirect,flash
import json  
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import or_, and_  
from flask import send_from_directory
import os 
import re  
BASEDIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_folder='static', static_url_path='/static')  # Flaskアプリケーションのインスタンスを作成
# Restrict CORS to the frontend origin used during development and avoid credentials when using '*'
CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:5173"},
    r"/admin/*": {"origins": "http://localhost:5173"}
}, supports_credentials=False)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')  
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASEDIR, 'recipes.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)  # SQLAlchemyのインスタンスを作成

class Recipe(db.Model):  # SQLAlchemyのモデルクラスを定義
    id = db.Column(db.Integer, primary_key=True)  
    title = db.Column(db.String(80), nullable=False)  
    description = db.Column(db.String(500), nullable=False)  
    image_url = db.Column(db.String(200), nullable=True)  
    ingredients = db.Column(db.PickleType, nullable=False)  
    steps = db.Column(db.PickleType, nullable=False) 
    time_min = db.Column(db.Integer, nullable=True)

class User(db.Model): # ログインモデル定義
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50),nullable=False)
    password_hash = db.Column(db.String(300),nullable=False)   
from sqlalchemy import text

db_path = os.path.join(BASEDIR, 'recipes.db')
print("FLASK_APP FILE :", __file__)
print("CWD           :", os.getcwd())
print("DB PATH       :", db_path)
print("EXISTS BEFORE :", os.path.exists(db_path))

with app.app_context():
    db.create_all() 
    db.session.execute(text("SELECT 1"))  

print("EXISTS AFTER  :", os.path.exists(db_path))

@app.route('/')  # ルートURL（ホーム）にアクセスしたときの処理
def home():
    return render_template('index.html', recipes=[])

@app.route('/api/search', methods=['POST', 'OPTIONS'])
@cross_origin()
def api_search_recipes():  
    # Accept both JSON and form-encoded bodies
    data = request.get_json(silent=True)
    if data is None:
        # fall back to form data (x-www-form-urlencoded)
        data = request.form.to_dict()
    query = (data.get('query') or '').strip()
    if not query:
        return jsonify({"status": "error", "message": "キーワードを入力してください"})
    keywords = query.strip().lower().split() 
    filtered_recipes = Recipe.query 
    for keyword in keywords:  
        filtered_recipes = filtered_recipes.filter(or_(
          (Recipe.title.like(f'%{keyword}%')),
          (Recipe.description.like(f'%{keyword}%'))
          )) # タイトルまたは説明にキーワードが含まれるレシピを絞る
    recipes_to_show = filtered_recipes.all()  
    recipes_dict = []  
    for recipe in recipes_to_show:  
        recipes_dict.append({
            'id': recipe.id,
            'title': recipe.title, 
            'description': recipe.description,
            'image_url': recipe.image_url,
            'ingredients': recipe.ingredients,
            'steps': recipe.steps,
            'time_min': recipe.time_min

        })
    if not recipes_to_show:  
        return jsonify({"status": "error", "message": "検索結果が見つかりませんでした"})  
    return jsonify({"status": "success", "data": recipes_dict, "count": len(recipes_dict)})  

@app.route('/api/search_by_ingredients', methods=['POST', 'OPTIONS'])
@cross_origin()
def api_search_by_ingredients():  
    # Accept both JSON and form-encoded bodies
    data = request.get_json(silent=True)
    if data is None:
        data = request.form.to_dict()
    search_type = data.get('search_type') or 'or'
    query = (data.get('query') or '').strip()
    if not query:
        return jsonify({"status": "error", "message": "キーワードを入力してください"})
    ingredients = query.lower().split()
    all_recipes = Recipe.query.all()  
    recipes_to_show = [] 
    for recipe in all_recipes: 
        recipe_ingredients = [i.lower()for i in recipe.ingredients] 
        if search_type == 'and':  
            all_ingredients_found = True 
            for ingredient in ingredients: 
                ingredient_found = False 
                for recipe_ingredient in recipe_ingredients: 
                    if ingredient in recipe_ingredient: 
                        ingredient_found = True 
                        break
                if not ingredient_found: 
                    all_ingredients_found = False 
                    break
            if all_ingredients_found: 
                recipes_to_show.append(recipe) 
        elif search_type == 'or': 
            or_found = False 
            for ingredient in ingredients: 
                for recipe_ingredient in recipe_ingredients: 
                    if ingredient in recipe_ingredient: 
                        or_found = True
                        break
                if or_found:
                    break 
            if or_found:
                recipes_to_show.append(recipe) 
    recipes_dict = []  
    for recipe in recipes_to_show:
        recipes_dict.append({
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'image_url': recipe.image_url,
            'ingredients': recipe.ingredients,
            'steps': recipe.steps,
            'time_min': recipe.time_min
        })
    if not recipes_to_show:
        return jsonify({"status": "error", "message": "検索結果が見つかりませんでした"})  
    return jsonify({"status": "success", "data": recipes_dict, "count": len(recipes_dict)}) 

@app.route('/api/recipes/<int:recipe_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def api_show_recipe(recipe_id): 
    recipe = Recipe.query.get(recipe_id) 
    if not recipe:  
        return jsonify({"status": "error", "message": "レシピが見つかりませんでした"})
    recipe_dict = {
        'id': recipe.id,
        'title': recipe.title,
        'description': recipe.description,
        'image_url': recipe.image_url,
        'ingredients': recipe.ingredients,
        'steps': recipe.steps,
        'time_min': recipe.time_min
    }
    return jsonify({"status": "success", "data": recipe_dict})  

@app.route('/admin/recipes',methods=['POST'])  
@cross_origin()
def add_recipe():
    # Accept JSON or form-encoded submissions
    data = request.get_json(silent=True)
    if data is None:
        form = request.form
        title = form.get('title')
        description = form.get('description')
        image_url = form.get('image_url') or "#"
        ingredients_raw = form.get('ingredients') or ""
        steps_raw = form.get('steps') or ""
        ingredients = ingredients_raw.splitlines() if isinstance(ingredients_raw, str) else ingredients_raw
        steps = steps_raw.splitlines() if isinstance(steps_raw, str) else steps_raw
        time_min = form.get('time_min')
    else:
        title = data.get('title')
        description = data.get('description')
        image_url = data.get('image_url') or "#"
        ingredients = data.get('ingredients') or []
        steps = data.get('steps') or []
        # normalize strings to lists
        if isinstance(ingredients, str):
            ingredients = ingredients.splitlines()
        if isinstance(steps, str):
            steps = steps.splitlines()
        time_min = data.get('time_min')

    # normalize time_min to int or None
    try:
        time_min = int(time_min) if time_min not in (None, "") else None
    except (ValueError, TypeError):
        time_min = None

    new_recipe = Recipe(  
        title=title,
        description=description,
        image_url=image_url,
        ingredients=ingredients,
        steps=steps,
        time_min=time_min
    )
    db.session.add(new_recipe)  
    db.session.commit()

    # If client sent JSON, return JSON response. If form, redirect (legacy behavior).
    if data is not None:
        return jsonify({"status": "success", "id": new_recipe.id})
    else:
        flash('新しいレシピが追加されました！')  
        return redirect('/')  


@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

if __name__ == "__main__":
    with app.app_context():  
        db.create_all()  
    app.run(debug=True, port=5001)