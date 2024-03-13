import { api, configure, time } from "goflowclient"
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function Test() {
    const [urlBase, setUrlbase] = useState("https://api.goflow.cc")
    const [tm, setTM] = useState(0)
    const [apistr, setAPI] = useState("")
    configure(urlBase)
    useEffect(() => {
        time().then((res) => {
            setTM(res)
        })
        api("hello", { text: "world" }).then((res) => {
            setAPI(res)
        })
    }, [])
    return (
        <div class="flex-col ml-10">
            <div class="flex-col space-x-6 text-gray-400 ">
                <div class="text-lg">Test current api server (you can modify it to test your api server):</div>
                {/* modifiable urlBase:  */}
                <div class="text-2xl  text-yellow-600 mb-7">
                    <input type="text" value={urlBase} onChange={(e) => setUrlbase(e.target.value)} />
                </div>
            </div>
            <div class="flex-col space-x-4 text-gray-400">
                <h2>result of Time</h2>
                <p class="text-xl  text-red-600">{tm}</p>
            </div>
            <div class="flex-col space-x-4 ">
                <h2 class="text-xl text-gray-400">result of calling demoapi</h2>
                <div class="text-xl text-blue-600">{apistr}</div>
            </div>


        </div>
    )
}