import { api, configure, time, Option } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';

const Test = () => {
    //const [urlBase, setUrlbase] = useState("https://api.doptime.com")
    const [urlBase, setUrlbase] = useState("http://localhost:80")
    const [tm, setTM] = useState(0)
    const [apistr, setAPI] = useState("")
    const [text, setText] = useState("text to send to server")
    const [err, setErr] = useState("no error")
    configure(urlBase,"",(err) => {
        //show error & body message
        setErr(err.toString() + " \n " + JSON.stringify(err.response.data))
    })
    useEffect(() => {
        setErr("no error")
        time(Option.rspTypeJson()).then((res) => {

            //convert unix timestamp to human readable time
            var time = new Date(res).toLocaleString();
            setTM(time);
        })
        api("hello", { text: text }).then((res) => {
            setAPI(res)
        })
    }, [text, urlBase])
    return (
        // using postcss-nested https://farer.org/2021/10/08/docusaurus-with-tailwindcss/
        <div className="tailwind">
            <div class=" flex-col ml-2" >
                <div class="flex-col space-x-6 text-gray-400 ">
                    <div class="text-lg">Test current api server (you can modify it to test your api server):</div>
                    {/* modifiable urlBase:  */}
                    <div class="text-2xl  text-yellow-600 mb-7 ring-1">
                        <input type="text" value={urlBase} onChange={(e) => setUrlbase(e.target.value)} />
                    </div>
                    <div class="text-lg">Test current Text to send (you can modify it to test your api server):</div>
                    <div class="text-2xl  text-yellow-600 mb-7 ring-1">
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                </div>
                <div class="flex-col space-x-4 text-gray-400">
                    <h2>result of server Time</h2>
                    <p class="text-xl  text-red-600">{tm}</p>
                </div>
                <div class="flex-col space-x-4 ">
                    <h2 class="text-xl text-gray-400">result of calling demoapi</h2>
                    <div class="text-xl text-blue-600">{apistr}</div>
                    <div class="text-xl text-red-600 ml-auto">{err}</div>
                </div>
            </div>

        </div>
    )
}
export default Test