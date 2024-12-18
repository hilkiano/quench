import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";
import Compressor from "compressorjs";

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

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export async function srcToFile(
  src: string,
  fileName: string,
  mimeType: string
) {
  return fetch(src)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], fileName, { type: mimeType });
    });
}

export const convertImage = async (image: File, filename: string) => {
  return new Promise<File | Blob>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const string = reader.result;
      if (string) {
        const file = await srcToFile(
          string as string,
          `${filename}.webp`,
          "image/webp"
        );

        new Compressor(file, {
          quality: 0.6,
          success: (result) => {
            resolve(result);
          },
        });
      }
    };
  });
};

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob;
  b.lastModifiedDate = new Date();
  b.name = fileName;

  return theBlob as File;
};

export const toDataURL = (url: string) =>
  fetch(url, {
    mode: "no-cors",
  })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          console.log("blob", blob);
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
