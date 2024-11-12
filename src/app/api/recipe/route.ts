import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const data = await request.json();
  const lang = cookieStore.get("NEXT_LOCALE");
  const loginSession = cookieStore.get("login_session");
  const response = await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}recipe/create`, data, {
      headers: {
        "x-app-locale": lang ? lang.value : "id",
        "x-token": loginSession ? loginSession.value : null,
      },
    })
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(
    { ...response.data },
    { headers: response.headers, status: response.status }
  );
}
