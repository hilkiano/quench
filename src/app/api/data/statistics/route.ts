import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const loginSession = cookieStore.get("login_session");
  const response = await axios
    .get(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }data/statistics?${searchParams.toString()}`,
      {
        headers: {
          "x-app-locale": lang ? lang.value : "id",
          "x-token": loginSession ? loginSession.value : null,
        },
        responseType: "json",
      }
    )
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(
    { ...response.data },
    { headers: response.headers, status: response.status }
  );
}
