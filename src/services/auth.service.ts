export async function handleLogout() {
  const response = await fetch("/api/auth/logout", {
    method: "post",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<string>) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.message, err);
    });

  return response;
}
