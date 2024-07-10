import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Option, { newApi } from 'doptime-client';
import { IsValidJwt, SetStorage } from '../../components/auth';
import { DoptimeApiServer } from '../../components/vars';

var apiSignInGithubToDoptime = newApi("signInGithubToDoptime", { in: {"Code":"","RedirectURI":"","State":""}, out: {"AvatarURL":"","Email":"","GithubID":0,"ID":"","UserName":""}})
const GitHubCallback = () => {
    const location = useLocation();
    useEffect(() => {
        // 解析 URL 中的查询参数
        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        const code = params.get('code');
        const redirectUri = params.get('redirect_uri');

        if (!code) return
        apiSignInGithubToDoptime({ Code: code, State: state, RedirectURI: redirectUri }).then((res) => {
            SetStorage("jwt", res)
            // redirect to the last page, stored in the state parameter
            if (IsValidJwt(res) && !!state) window.location.href = decodeURI(state)
        })

    }, [location]);

    return (
        <div>
            <p>Processing GitHub authentication...</p>
        </div>
    );
};

export default GitHubCallback;