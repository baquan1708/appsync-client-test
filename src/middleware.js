import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "./utils/server-utils";

export async function middleware(request) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        console.log('@@@', session)
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

  if (authenticated) {
    return response;
  }

  const parsedURL = new URL(request.url);
  const path = parsedURL.pathname;

  return NextResponse.redirect(new URL(`/login?origin=${path}`, request.url));
}

export const config = {
  matcher: ["/events/:path*"],
};