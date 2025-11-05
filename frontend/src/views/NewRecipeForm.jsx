import "../App.css";
const NewRecipeForm = ({ newRecipe, setNewRecipe, addNewRecipe }) => {
  const newTitle = (e) => {
    setNewRecipe({ ...newRecipe, title: e.target.value });
  };
  const newDescription = (e) => {
    setNewRecipe({ ...newRecipe, description: e.target.value });
  };
  const newImage = (e) => {
    setNewRecipe({ ...newRecipe, image_url: e.target.value });
  };
  const newTime = (e) => {
    setNewRecipe({ ...newRecipe, time_min: e.target.value });
  };
  const newIngredients = (e) => {
    const ingredientsArray = e.target.value.split("\n");
    setNewRecipe({ ...newRecipe, ingredients: ingredientsArray });
  };
  const newStep = (e) => {
    const stepArray = e.target.value.split("\n");
    setNewRecipe({ ...newRecipe, steps: stepArray });
  };

  return (
    <div className="new-recipe-form">
      <h3>
        タイトル:{" "}
        <input type="text" value={newRecipe.title} onChange={newTitle} />
      </h3>
      <h3>
        説明:{" "}
        <textarea value={newRecipe.description} onChange={newDescription} />
      </h3>
      <h3>
        画像URL:{" "}
        <input type="url" value={newRecipe.image_url} onChange={newImage} />
      </h3>
      <h3>
        調理時間(分):
        <input type="number" value={newRecipe.time_min} onChange={newTime} />
      </h3>
      <h3>
        材料 (1行ごとに入力):
        <textarea
          value={
            Array.isArray(newRecipe.ingredients)
              ? newRecipe.ingredients.join("\n")
              : newRecipe.ingredients
          }
          onChange={newIngredients}
        />
      </h3>
      <h3>
        作り方 (1行ごとに入力):
        <textarea
          value={
            Array.isArray(newRecipe.steps)
              ? newRecipe.steps.join("\n")
              : newRecipe.steps
          }
          onChange={newStep}
        />
      </h3>
      <button onClick={addNewRecipe}>レシピを追加</button>
    </div>
  );
};
export default NewRecipeForm;
