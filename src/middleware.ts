import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";

const intlMiddleware = (
  request: NextRequest,
  userData?: JsonResponse<Userdata>
) => {
  const url = new URL(request.url);
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  // Set headers
  response.headers.set("x-url", request.url);
  response.headers.set("x-origin", url.origin);
  response.headers.set("x-pathname", url.pathname);

  if (userData) {
    response.headers.set("x-userdata", JSON.stringify(userData.data));
  }

  return response;
};

const getUserdata = async (request: NextRequest) => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE");
  const loginSession = cookieStore.get("login_session");

  return await fetch(`${process.env.SERVER_API_URL}auth/me`, {
    method: "get",
    headers: {
      "x-app-locale": locale ? locale.value : "en",
      "x-token": loginSession ? loginSession.value : "",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<Userdata>) => {
      if (!res.status) {
        const url = new URL("/", request.url);
        const response = NextResponse.redirect(url);
        response.cookies.delete("login_session");

        return response;
      }

      return intlMiddleware(request, res);
    })
    .catch((err: Error) => {
      console.error(err);
      return NextResponse.json({
        error: "Unexpected error from the server.",
        cause: err,
      });
    });
};

export default async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const loginSession = cookieStore.get("login_session");
  if (loginSession) {
    return getUserdata(request);
  } else {
    return intlMiddleware(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
