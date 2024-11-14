import { cleanData } from "@/libs/helpers";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const searchParams = request.nextUrl.searchParams;
  const lang = cookieStore.get("NEXT_LOCALE");
  const loginSession = cookieStore.get("login_session");
  const response = await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_URL}data/list?${searchParams.toString()}`,
      {
        headers: {
          "x-app-locale": lang ? lang.value : "id",
          "x-token": loginSession ? loginSession.value : null,
        },
        withCredentials: true,
      }
    )
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(
    { ...response.data },
    {
      headers: cleanData({ ...response.headers, "content-length": undefined }),
      status: response.status,
    }
  );
}
