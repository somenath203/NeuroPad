import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api(.*)']);


export default clerkMiddleware(async (auth, request) => {

  // If the route is public, allow it
  if (isPublicRoute(request)) {

    return;

  }


  // If the user is not authenticated and the route is private, redirect to sign-in
  const { userId } = await auth();

  if (!userId) {

    (await auth()).redirectToSignIn;

  }


  // Otherwise, protect the route
  await auth.protect();


});


export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}