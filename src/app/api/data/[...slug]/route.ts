import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const cookieStore = cookies();
  const slugs = await params;
  const dynamicPath = slugs.slug.map(encodeURIComponent).join("/");

  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}data/get/${dynamicPath}`, {
      headers: {
        "x-app-locale": lang ? lang.value : "id",
        "x-token": jwt ? jwt.value : null,
      },
      withCredentials: true,
    })
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(
    { ...response.data },
    { headers: response.headers, status: response.status }
  );
}
