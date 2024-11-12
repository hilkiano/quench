import { ComboboxData } from "@mantine/core";

type TComboboxParams = {
  model: string;
  label: string;
  value: string;
};

type TListParams = {
  model: string;
  page?: string;
  limit?: string;
  sort?: string;
  sort_direction?: string;
  with_trashed?: "true" | "false";
  relations?: string;
  global_filter?: string;
  global_filter_columns?: string;
};

export async function getComboboxData(params: TComboboxParams) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`/api/data/combobox?${queryParams}`, {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<ComboboxData>) => {
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

export async function getList<T>(params: TListParams) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`/api/data/list?${queryParams}`, {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<ListResult<T>>) => {
      if (res.status) {
        return res;
      }

      throw new Error(res.message, { cause: res });
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}
