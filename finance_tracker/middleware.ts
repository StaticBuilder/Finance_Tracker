import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
    publicRoutes:['/']
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

//https://clerk.com/docs/references/nextjs/clerk-middleware
//https://stackoverflow.com/questions/78357339/authmiddleware-doesnt-exist-after-installing-clerk
//https://clerk.com/docs/quickstarts/nextjs