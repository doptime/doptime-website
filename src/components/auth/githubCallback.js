import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import configure, { api, setDefaultSUToken } from 'doptime-client';
import { SetStorage } from '.';

const GitHubCallback = () => {
    const location = useLocation();
    const [redirectUrl, setRedirectUrl] = useState(null);

    useEffect(() => {
        if (!!redirectUrl) {
            //redirect to the page
            window.history.back()
        }
    }, [redirectUrl])


    useEffect(() => {
        // 解析 URL 中的查询参数
        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        const code = params.get('code');


        // 通知服务器端
        if (code) {
            api("signInGithubToDoptime", { code }).then((res) => {
                SetStorage("jwt", res)
            }).catch((err) => {
            }).finally(() => {
            })
        }

        // 重定向回原始页面
        if (state) {
            window.location.href = decodeURIComponent(state);
        }
    }, [location]);

    return (
        <div>
            <p>Processing GitHub authentication...</p>
        </div>
    );
};

export default GitHubCallback;