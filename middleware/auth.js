import jwt from 'jsonwebtoken';

export default function (context) {
    const{ store, redirect, route, path, auth } = context;

    if (process.client) {
      if (store.state.user.isLoggedIn && route.path === "/") {
        return redirect("/home");
      } 
    }

    if (process.server) {
      const { req, res, beforeNuxtRender } = context;
        let refresh_token_cookie = getCookie("refresh_token", req.headers.cookie);
        if( refresh_token_cookie !== "" && route.path === '/' ) {
          return redirect("/home");
        }
        else if (refresh_token_cookie === "" && route.path !== '/reset-password') {
          return redirect("/");
        }
    }
}

function getCookie(cname, string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(string);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }