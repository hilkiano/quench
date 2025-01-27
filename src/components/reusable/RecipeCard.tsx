import { cn, recipeKeys } from "@/utils";
import {
  Card,
  CardProps,
  Text,
  Image,
  Badge,
  Button,
  Group,
  Switch,
} from "@mantine/core";
import {
  IconEdit,
  IconEye,
  IconEyeOff,
  IconHeart,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { Link } from "@/i18n/routing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFn, restoreFn } from "@/services/crud.service";

dayjs.extend(relativeTime);

type TRecipeCard = {
  recipe: Recipe;
  hideStatus?: boolean;
  hideUser?: boolean;
  isOwner?: boolean;
  withStats?: boolean;
};

const RecipeVisibility = ({ recipe }: { recipe: Recipe }) => {
  const [checked, setChecked] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (data: {
      class: "Recipe";
      payload: {
        payload: Partial<Recipe>;
      };
    }) => deleteFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (data: {
      class: "Recipe";
      payload: {
        payload: Partial<Recipe>;
      };
    }) => restoreFn<Recipe>(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (!recipe.deleted_at) {
      deleteMutation.mutate({
        class: "Recipe",
        payload: {
          payload: {
            id: recipe.id,
          },
        },
      });
    } else {
      restoreMutation.mutate({
        class: "Recipe",
        payload: {
          payload: {
            id: recipe.id,
          },
        },
      });
    }
    setChecked(e.currentTarget.checked);
  };

  useEffect(() => {
    if (recipe.deleted_at) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  }, [recipe.deleted_at]);

  return (
    <Switch
      checked={checked}
      onChange={handleCheck}
      onLabel={<IconEye size={18} />}
      offLabel={<IconEyeOff size={18} />}
      size="md"
    />
  );
};

const RecipeCard = forwardRef<HTMLDivElement, CardProps & TRecipeCard>(
  (props, ref) => {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Recipe");
    const locale = useLocale();
    const {
      isOwner,
      className,
      recipe,
      hideStatus,
      hideUser,
      withStats,
      ...cardProps
    } = props;

    const RecipeStats = () => (
      <Group grow>
        <div className="flex gap-2 opacity-60">
          <IconEye />
          {Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(recipe.meta ? recipe.meta.views : 0)}
        </div>
        <div className="flex gap-2 opacity-60">
          <IconHeart />
          {Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(recipe.meta ? recipe.meta.likes : 0)}
        </div>
        <div className="flex gap-2 opacity-60">
          <IconMessageCircle />
          {Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(recipe.comments ? recipe.comments.length : 0)}
        </div>
      </Group>
    );

    return (
      <Card
        ref={ref}
        className={cn("p-0 drop-shadow-md rounded-xl flex-col", className)}
        {...cardProps}
      >
        {!hideUser && (
          <Card.Section className="w-full p-4 mt-0 mr-0 ml-0">
            <Text className="font-mulish font-bold line-clamp-1">
              {recipe.user?.username
                ? recipe.user.username
                : recipe.user?.email}
            </Text>
            <Text className="opacity-70 text-sm">
              {dayjs(recipe.created_at).locale(locale).fromNow()}
            </Text>
          </Card.Section>
        )}
        <Card.Section className="relative">
          <Image
            className={cn("transition-all duration-500", {
              "mt-4": hideUser,
              grayscale: recipe.deleted_at,
            })}
            src={recipe.image_url}
            alt={`${recipe.title} image`}
          />
          {isOwner && (
            <div
              className={cn("absolute top-2 left-6 flex gap-2 items-center", {
                "top-6": hideUser,
              })}
            >
              <RecipeVisibility recipe={recipe} />
            </div>
          )}

          <div
            className={cn("absolute top-2 right-6 flex gap-2 items-center", {
              "top-6": hideUser,
            })}
          >
            {!hideStatus && (
              <Badge size="lg" variant="dot" className="font-mulish">
                {t(`Card.${recipe.status.toLowerCase()}`)}
              </Badge>
            )}
          </div>
        </Card.Section>
        <Card.Section className="flex flex-col gap-2 w-full p-4 mt-0 mr-0 ml-0 mb-2">
          <Text className="font-zzz text-lg">{recipe.title}</Text>
          {withStats && <RecipeStats />}
          <Button
            component={Link}
            href={`/recipe/${recipe.id}`}
            variant="gradient"
            className="rounded-lg mt-2"
            leftSection={<IconEye />}
          >
            {tCommon("Button.view")}
          </Button>
          {isOwner && (
            <Button
              component={Link}
              href={`/edit/${recipe.id}`}
              variant="outline"
              className="rounded-lg"
              leftSection={<IconEdit size="14" />}
            >
              {tCommon("Button.edit")}
            </Button>
          )}
        </Card.Section>
      </Card>
    );
  }
);

RecipeCard.displayName = "RecipeCard";
export default RecipeCard;
