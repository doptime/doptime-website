import React, { useEffect, useState } from 'react'; import axios from "axios";
import Option from 'doptime-client';
import { DoptimeApiServer, DoptimeWebServer } from '../vars';

export const SetStorage = (url, data) => typeof window !== 'undefined' && localStorage.setItem(url, JSON.stringify(data));
export const DelStorage = (key) => typeof window !== 'undefined' && localStorage.removeItem(key);
export const GetStorage = (key) => {
    let data = typeof window !== 'undefined' && localStorage.getItem(key);
    if (!data) return null;;
    try {
        return JSON.parse(data)
    } catch (e) { }
    return null
};
export const IsValidJwt = (jwt) => !!jwt && !!jwt["jwt"] && !!jwt["id"];

export const LoginStatusDispatch = data => dispatchEvent(new CustomEvent("Login", { detail: { status: data } }))


export const AuthMenu = (props) => {
    const [jwt, setJwt] = useState(GetStorage("jwt"))
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setLoggedIn(IsValidJwt(jwt))
        // if (IsValidJwt(jwt)) configure(DoptimeApiServer, jwt.jwt, null)
        var ops = { urlBase: DoptimeApiServer, primaryErrorHandler: (err) => null }
        if (IsValidJwt(jwt)) ops.token = jwt.jwt
        Option.setDefaults(ops)
    }, [jwt])

    useEffect(() => {
        //handle event for:   dispatchEvent(new CustomEvent(Events.Login, { detail: { status: data.IsValid() } }));
        window.addEventListener("Login", event => {
            const status = event?.detail.status
            if (status) SetStorage("jwt", status)
        })
        //handle event for:     dispatchEvent(new CustomEvent("auth", { detail: { page: AuthPage } }));
        window.addEventListener("Redirect", event => {
            const page = event?.detail.page
            setRedirectUrl(page)
        })
        return () => {
        }
    }, [])

    const githubLogin = () => {
        const currentUrl = window.location.href;

        // GitHub OAuth 2.0 授权 URL
        const clientId = 'Ov23liV0jtpVTO8vtrn9';
        const redirectUri = `${DoptimeWebServer}/auth/githubCallback`;  // 本地回调 URL
        const scope = 'read:user user:email';
        const state = encodeURIComponent(currentUrl);
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        // 跳转到 GitHub 登录
        window.location.href = githubAuthUrl;
    }

    return <div className='flex flex-row w-fit h-fit bg-white space-x-2 self-center whitespace-nowrap'>
        {loggedIn && (
            <div className="relative group">
                <div
                    className="mx-3  relative z-50 transition-opacity duration-300 "
                    onClick={() => {
                        DelStorage("jwt")
                        setJwt(null)
                    }}
                >
                    {!!jwt?.avatar_url ? <img src={jwt.avatar_url} className="h-12 w-12  overflow-clip" /> : "😊"}
                </div>
                <div className="absolute  z-50 top-full left-0 w-full flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 invisible group-hover:visible group-hover:opacity-100"
                    onClick={() => {
                        DelStorage("jwt")
                        setJwt(null)
                    }}
                >
                    <span className="text-white bg-black bg-opacity-75 px-8 rounded">Sign Out</span>
                </div>
            </div>
        )}
        {!loggedIn && (
            <div className="flex flex-row gap-2">
                {/* <div className="button button--secondary button--lg" onClick={githubLogin}>
                    Sign in with Google
                </div> */}
                <div className="button button--secondary button--lg" onClick={githubLogin}>
                    Sign in with GitHub
                </div>
            </div>
        )}
    </div>
}