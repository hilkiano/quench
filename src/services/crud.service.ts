type TDeleteRestore<T> = {
  class: string;
  payload: {
    payload: Partial<T>;
  };
};

export async function deleteFn<T>(requestData: TDeleteRestore<T>) {
  const response = await fetch(`/api/crud`, {
    method: "DELETE",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<null>) => {
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

export async function restoreFn<T>(requestData: TDeleteRestore<T>) {
  const response = await fetch(`/api/crud`, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<null>) => {
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
