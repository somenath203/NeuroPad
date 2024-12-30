import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api(.*)']);


export default clerkMiddleware(async (auth, request) => {

  // Allow public routes
  if (isPublicRoute(request)) {

    return;
  
  }


  const { userId } = await auth();

  // Skip POST requests after logout by Clerk
  if (request.method === 'POST' && !userId) {

    return (await auth()).redirectToSignIn();
    

  }

  // Protect private routes
  await auth.protect();

});


export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}