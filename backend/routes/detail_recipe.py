from flask import Blueprint, jsonify
from flask_cors import cross_origin
from models import Recipe

detail_bp = Blueprint("detail_bp", __name__)
@detail_bp.route('/api/recipes/<int:recipe_id>', methods=['GET', 'OPTIONS'])
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