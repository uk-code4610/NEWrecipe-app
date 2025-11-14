from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import Recipe
from app import db

add_recipe_bp = Blueprint("add_recipe", __name__)


@add_recipe_bp.route("/admin/recipes", methods=["POST"])
@cross_origin()
def add_recipe():
    data = request.get_json(silent=True)
    if data is None:
        form = request.form
        title = form.get("title")
        description = form.get("description")
        image_url = form.get("image_url") or "#"
        ingredients_raw = form.get("ingredients") or ""
        steps_raw = form.get("steps") or ""
        ingredients = (
            ingredients_raw.splitlines()
            if isinstance(ingredients_raw, str)
            else ingredients_raw
        )
        steps = steps_raw.splitlines() if isinstance(steps_raw, str) else steps_raw
        time_min = form.get("time_min")
    else:
        title = data.get("title")
        description = data.get("description")
        image_url = data.get("image_url") or "#"
        ingredients = data.get("ingredients") or []
        steps = data.get("steps") or []
        if isinstance(ingredients, str):
            ingredients = ingredients.splitlines()
        if isinstance(steps, str):
            steps = steps.splitlines()
        time_min = data.get("time_min")

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
        time_min=time_min,
    )
    db.session.add(new_recipe)
    db.session.commit()

    if data is not None:
        return jsonify({"status": "success", "id": new_recipe.id})
    else:
        return jsonify(
            {"status": "success", "message": "新しいレシピが追加されました！"}
        )
