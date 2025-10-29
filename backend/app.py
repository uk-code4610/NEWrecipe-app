from flask_cors import CORS
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
CORS(app)
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
@app.route('/api/search', methods=['POST']) 
def api_search_recipes():  
    data = request.get_json()
    query = request.form.get('query')  
    if not query.strip():  
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

@app.route('/api/search_by_ingredients',methods=['POST'])  
def api_search_by_ingredients():  
    data = request.get_json()
    search_type = request.form.get('search_type') 
    query = request.form.get('query')  
    if not query.strip():  
        return jsonify({"status": "error", "message": "キーワードを入力してください"})  
    ingredients = query.strip().lower().split()  
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

@app.route('/api/recipes/<int:recipe_id>', methods=['GET']) 
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

@app.route('/admin/recipes/new',methods=['GET']) 
def new_recipe():
    return render_template('new_recipe.html')  

@app.route('/admin/recipes',methods=['POST'])  
def add_recipe():
    title = request.form.get('title')
    description = request.form.get('description')
    image_url = request.form.get('image_url')
    if not image_url:
        image_url = "#"  
    ingredients = request.form.get('ingredients').splitlines()  
    steps = request.form.get('steps').splitlines()  
    time_min = request.form.get('time_min') #
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
    flash('新しいレシピが追加されました！')  
    return redirect('/')  
@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

if __name__ == "__main__":
    with app.app_context():  
        db.create_all()  
    app.run(debug=True)