import { api, configure, time, Option, scan, zRangeByScore, zRevRangeByScore, setDefaultSUToken, lRange, hMGet, rename, type, hKeys, ttl, hGet } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import KeyViewer from "./keyViewer"

const RdsGUI = () => {

    //const [urlBase, setUrlbase] = useState("https://api.doptime.com")
    const [urlBase, setUrlbase] = useState("http://localhost:80")
    const [suToken, setSUToken] = useState("HboVsNf0bMa1fYq9HXr02SaRD7yz3gyj")

    const [KeysToQuery, setKeysToQuery] = useState("*")

    const [keys, setKeys] = useState([])

    const [selectedKey, setSelectedKey] = useState("")

    const [items, setLogs] = useState([])
    const [hashToLogText, setHashToLogText] = useState({})
    setDefaultSUToken(suToken)
    configure(urlBase, "", (err) => {

    })
    useEffect(() => {
        //search keys start with "doptimelog:" in local storage
        scan(0, KeysToQuery, 4096).then((res) => {
            setKeys(res?.keys)
            var defaultKey = res?.keys[0]
            setSelectedKey(defaultKey)

        })
    }, [KeysToQuery])

    useEffect(() => {
        if (!selectedKey) return



    }, [selectedKey])

    return (
        // using postcss-nested https://farer.org/2021/10/08/docusaurus-with-tailwindcss/
        <div class="flex flex-row px-1 w-full h-full gap-2" >


            <div name="leftPanel" class="flex-col w-[39%]">
                {/* select database  & set sutoken */}
                <div class="flex-row  text-gray-400 w-full  p-2 gap-1 ">

                    {/* select database */}
                    <div class="flex-col w-full">
                        <div class="text-lg">Test current api server:</div>
                        {/* modifiable urlBase:  */}
                        <input class="text-xl  text-yellow-600 mb-2 ring-1 w-full p-1" type="text" value={urlBase} onChange={(e) => setUrlbase(e.target.value)} />
                    </div>

                    <div class="flex-col w-full ">
                        <div class="text-lg">SUToken:</div>
                        {/* modifiable urlBase:  */}
                        <input class="text-xl  text-yellow-600 mb-2 ring-1 w-full p-1" type="text" value={suToken} onChange={(e) => setSUToken(e.target.value)} />
                    </div>

                </div>


                {/* display filter keys */}
                <div class="flex-col space-x-4 w-full p-2 ">
                    <div class="flex flex-row space-x-4 ring-2 ring-gray-200 bg-slate-300 rounded-lg p-1">
                        <input type="text" value={KeysToQuery} onChange={(e) => setKeysToQuery(e.target.value)} class="w-full p-1" />
                        <button class="text-lg ring-2 ring-gray-200 bg-slate-300 rounded-lg p-1 whitespace-nowrap"
                            onClick={() => {
                                scan(0, KeysToQuery, 4096).then((res) => {
                                    setKeys(res?.keys)
                                })
                            }}>fielter keys</button>
                    </div>
                </div>

                {/* display dbs, allow select db */}
                <div class="flex-col space-x-4 ">
                    <h2 class="text-xl text-gray-400">Keys:</h2>

                    {keys?.length > 0 && keys.map((key) => <div class={"text-base odd:bg-gray-50 " + (key === selectedKey && " bg-yellow-100")} onClick={() => {
                        setSelectedKey(key)
                    }}>
                        {key?.indexOf(":") > 0 ? "📁" : "📄"}{key}
                    </div>)}
                </div>
            </div>

            {/* display logs by query zset of seleted db */}
            <div name="rightPanel" class="flex-col w-[59%] h-full">

                <KeyViewer selectedKey={selectedKey} setSelectedKey={setSelectedKey} key={selectedKey} />

                <div class="flex-col space-x-4  ">
                    {
                        //logs is array of string, each string is a log item
                        items?.map(log => {
                            const items = log.split(":");
                            return (
                                <div className="flex flex-row space-x-4" key={items[0]}>
                                    <div className="text-gray-400">{new Date(parseInt(items[0])).toLocaleString()}</div>
                                    <div className="text-gray-400">{hashToLogText[items[1]]}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default RdsGUI;