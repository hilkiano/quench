type TCreateRecipe = Partial<Recipe> & {
  ingredients: Partial<RecipeIngredient>[];
  steps: Partial<RecipeStep>[];
};

export async function createRecipe(payload: TCreateRecipe) {
  const response = await fetch(`/api/recipe`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<any>) => {
      if (res.status) {
        return res.data;
      }

      throw new Error(res.message, { cause: res });
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}
