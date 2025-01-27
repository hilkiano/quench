import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import { getTranslations } from "next-intl/server";
import axios from "axios";
import { cookies } from "next/headers";
import RecipeContainer from "@/components/recipe/RecipeContainer";

async function getRecipe(id: string) {
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  return await axios
    .get(
      `${process.env.SERVER_API_URL}data/get/Recipe/${id}/method&steps&ingredients.unit&user`,
      {
        headers: {
          "x-app-locale": lang ? lang.value : "id",
          "x-token": jwt ? jwt.value : null,
        },
        withCredentials: true,
      }
    )
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }

      throw new Error(res.statusText, { cause: res });
    })
    .catch((res) => res.response);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: "Recipe",
  });

  const recipe: JsonResponse<Recipe> = await getRecipe((await params).id);

  return {
    title: t("Meta.title", { recipe: recipe.data.title }),
    description: t("Meta.description", {
      title: recipe.data.title,
      description: recipe.data.description,
    }),
  };
}

export default async function Recipe({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const recipe: JsonResponse<Recipe> = await getRecipe((await params).id);

  return <RecipeContent recipe={recipe.data} />;
}

type TRecipeContent = {
  recipe: Recipe;
};

function RecipeContent({ recipe }: TRecipeContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Common", "Recipe", "Form"])}
    >
      <RecipeContainer recipe={recipe} />
    </NextIntlClientProvider>
  );
}
