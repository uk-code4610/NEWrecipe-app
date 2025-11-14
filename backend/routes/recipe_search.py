from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import Recipe
from sqlalchemy import or_

search_bp = Blueprint("search_bp", __name__)

@search_bp.route('/api/search', methods=['POST', 'OPTIONS'])
@cross_origin()
def api_search_recipes():  
    data = request.get_json(silent=True)
    if data is None:
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
          ))
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

@search_bp.route('/api/search_by_ingredients', methods=['POST', 'OPTIONS'])
@cross_origin()
def api_search_by_ingredients():  
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