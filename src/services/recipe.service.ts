type TCreateRecipe = Partial<Recipe> & {
  ingredients: Partial<RecipeIngredient>[];
  steps: Partial<RecipeStep>[];
};

export async function createRecipe(formData: FormData) {
  const response = await fetch(`/api/recipe`, {
    method: "PUT",
    body: formData,
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

export async function updateRecipe(formData: FormData) {
  const response = await fetch(`/api/recipe`, {
    method: "PATCH",
    body: formData,
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
