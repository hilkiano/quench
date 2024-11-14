import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";

export function cleanData<T>(data: T) {
  for (const key in data) {
    if (data[key] === undefined) {
      delete data[key];
    }
  }

  return data;
}

type TListQueryParams = {
  sorting?: ColumnSort[];
  pagination?: PaginationState;
  globalFilter?: string;
  globalFilterColumns?: string;
  columnFilters?: ColumnFiltersState;
  withTrashed?: boolean;
};

export const generateListQueryParams = (props: TListQueryParams) => {
  const params: any = new Object();
  if (props.sorting && props.sorting.length > 0) {
    props.sorting.map((sort) => {
      params.sort = sort.id;
      params.sort_direction = sort.desc ? "desc" : "asc";
    });
  }
  if (props.globalFilter !== "") {
    params.global_filter = props.globalFilter;
    params.global_filter_columns = props.globalFilterColumns;
  }
  if (props.withTrashed) {
    params.with_trashed = props.withTrashed;
  }

  if (props.pagination) {
    params.page = (props.pagination.pageIndex + 1).toString();
    params.limit = props.pagination.pageSize.toString();
  }

  if (props.columnFilters && props.columnFilters.length > 0) {
    params.filter = JSON.stringify(props.columnFilters);
  }

  return params;
};

export const validateYouTubeUrl = (url: string) => {
  if (url !== "") {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return true;
    } else {
      return false;
    }
  }

  return true;
};
