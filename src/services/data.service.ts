import { ComboboxData } from "@mantine/core";
import { ColumnFiltersState } from "@tanstack/react-table";

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
  filters?: string;
};

type TStatisticsParams = {
  type: string;
  user_id?: string;
};

type TGet = {
  class: string;
  id: string | number;
  relations?: string;
};

export async function getData<T>(requestData: TGet) {
  const dynamicPath = [
    requestData.class,
    requestData.id,
    requestData.relations ?? "",
  ].join("/");
  const url = `/api/data/${dynamicPath}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<T>) => {
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

export async function getStatistics<T>(params: TStatisticsParams) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`/api/data/statistics?${queryParams}`, {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<any>) => {
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
