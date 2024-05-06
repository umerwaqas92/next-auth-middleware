import { NextResponse } from 'next/server'
import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";


// paths that require authentication or authorization
const requireAuth = ["/app"];
  const ContAccesAfterLogin=["/auth/signin","/auth/signup"]

export async function middleware(request) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.SECRET,
  });


  console.log("middleware", request.url, token)

  if(ContAccesAfterLogin.some((path) => pathname.startsWith(path))){
    if (token) {
      const url = new URL(`/app`, request.url);
      return NextResponse.redirect(url);
    }
  }
  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.SECRET,
    });
    //check not logged in
    if (!token) {
      const url = new URL(`/api/auth/signin`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    //check if not authorized
    // if (token.role !== "admin") {
    //   const url = new URL(`/403`, request.url);
    //   return NextResponse.rewrite(url);
    // }
  }
  return res;
}



// This function can be marked `async` if using `await` inside
// export async function middleware(request) {
//   // const session = await getSession({ req: request });

//   const publicRoutes=["/","/login","/signup"]
//   const ContAccesAfterLogin=["/login","/signup"]
//   const privateRoutes=["/account","/app","/app/account","/app/trash"]

//   console.log("middleware",request.url,session)


 

//   if(ContAccesAfterLogin.includes(request.nextUrl.pathname) && session){
//     return NextResponse.redirect(new URL('/app', request.url))
//   }

//   if(privateRoutes.includes(request.nextUrl.pathname) && !session){
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if(publicRoutes.includes(request.nextUrl.pathname)){
//     return NextResponse.next()
//   }


//   // const puliblicPages = ["/", "/login", "/signup"];


//   // const serverSideSession=getServerSession()
//   // console.log("middleware",serverSideSession)
  
//   // return NextResponse.redirect(new URL('/home', request.url))
//   // return NextResponse.redirect(new URL( request.url))
//   return NextResponse.next()

  
// }
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/auth/:path*', '/app/:path*'],
}
