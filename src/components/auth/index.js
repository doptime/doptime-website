import React, { useEffect, useState } from 'react'; import axios from "axios";
import { Link } from '@docusaurus/router';
import configure from 'doptime-client';

export const SetStorage = (url, data) => typeof window !== 'undefined' && localStorage.setItem(url, JSON.stringify(data));
export const DelStorage = (key) => typeof window !== 'undefined' && localStorage.removeItem(key);
export const GetStorage = (key) => {
    let data = typeof window !== 'undefined' && localStorage.getItem(key);
    if (!data) return null;;
    try {
        let ret = JSON.parse(data)
        return ret;

    } catch (e) { }
    return null
};
export const IsValidJwt = (jwt) => !!jwt && !!jwt["jwt"] && !!jwt["id"];

export const LoginStatusDispatch = data => dispatchEvent(new CustomEvent("Login", { detail: { status: data } }))

export const AuthMenu = () => {
    const [jwt, setJwt] = useState(GetStorage("jwt"))
    useEffect(() => {
        if (!IsValidJwt(jwt)) return;
        configure("https://api.doptime.com/", jwt.jwt, null)
    }, [])


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
        const redirectUri = 'https://www.doptime.com/auth/githubCallback';  // 本地回调 URL
        const scope = 'read:user user:email';
        const state = encodeURIComponent(currentUrl);
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        window.history.pushState({}, null, currentUrl);
        // 跳转到 GitHub 登录
        window.location.href = githubAuthUrl;
    }
    return <div className='flex flex-row w-fit bg-white space-x-2 self-center  whitespace-nowrap'>
        {
            !IsValidJwt(jwt) && <div>
                <div className="button button--secondary button--lg" to="/logout" onClick={() => {
                    DelStorage("jwt")
                    setJwt(null)
                }}>
                    Logout
                </div>
            </div>
        }
        {
            IsValidJwt(jwt) && <div className="flex flex-row gap-2">
                <div className="button button--secondary button--lg" onClick={githubLogin}>
                    Sign in with Google
                </div>
                <div className="button button--secondary button--lg" onClick={githubLogin}>
                    Sign in with GitHub
                </div>
            </div>

        }
    </div>
}