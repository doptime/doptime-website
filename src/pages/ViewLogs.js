import Layout from "@theme/Layout";
import { Option, scan, lKey, hKey } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';
const ViewLogs = () => {

    //const [urlBase, setUrlbase] = useState("https://api.doptime.com")
    const [urlBase, setUrlbase] = useState("http://localhost:80")
    const [suToken, setSUToken] = useState("HboVsNf0bMa1fYq9HXr02SaRD7yz3gyj")
    const [dbs, setDBS] = useState([])
    const [seleceddb, setSelectedDB] = useState("")
    const [logs, setLogs] = useState([])
    const [hashToLogText, setHashToLogText] = useState({})
    Option.setDefaults({
        urlBase: urlBase, sutoken: suToken, primaryErrorHandler: (err) => {
            //show error & body message
            // setErr(err.toString() + " \n " + JSON.stringify(err.response?.data))
        }
    })
    useEffect(() => {
        //search keys start with "doptimelog:" in local storage
        scan(0, "doptimelog:*", 4096).then((res) => {
            setDBS(res?.keys)
            setSelectedDB(res?.keys[0])
        })
    }, [])

    useEffect(() => {
        if (!seleceddb) return
        var lkey = new lKey(seleceddb)
        //get all logs in selected db
        lkey.lRange(-32768, -1).then((res) => {
            var tags = []
            for (var i = 0; i < res?.length; i++) {
                var items = res[i].split(":")
                tags.push(items[1])
            }
            //remove redundant tags
            tags = [...new Set(tags)]
            var lkey = new hKey(seleceddb.replace("doptimelog:", "doptimelogtext:"))
            lkey.hMGet(tags).then((res) => {
                var hashToLogText = {}
                for (var i = 0; i < res?.length; i++) {
                    hashToLogText[tags[i]] = res[i]
                }
                setHashToLogText(hashToLogText)
            })
            setLogs(res)
        })

    }, [seleceddb])

    return (
        // using postcss-nested https://farer.org/2021/10/08/docusaurus-with-tailwindcss/
        <Layout>
            <div class=" flex-col ml-2" >
                <div class="flex-col space-x-6 text-gray-400 ">
                    <div class="text-lg">SUToken:</div>
                    {/* modifiable urlBase:  */}
                    <div class="text-2xl  text-yellow-600 mb-7 ring-1">
                        <input type="text" value={suToken} onChange={(e) => setSUToken(e.target.value)} />
                    </div>

                    <div class="text-lg">Test current api server (you can modify it to test your api server):</div>
                    {/* modifiable urlBase:  */}
                    <div class="text-2xl  text-yellow-600 mb-7 ring-1">
                        <input type="text" value={urlBase} onChange={(e) => setUrlbase(e.target.value)} />
                    </div>
                </div>
                {/* display dbs, allow select db */}
                <div class="flex-col space-x-4 ">
                    <h2 class="text-xl text-gray-400">select db</h2>
                    <select value={seleceddb} onChange={(e) => setSelectedDB(e.target.value)}>
                        {dbs?.length > 0 && dbs.map((db) => {
                            return <option value={db}>{db}</option>
                        })}
                    </select>
                </div>

                {/* display logs by query zset of seleted db */}
                <div>
                    <h2 class="text-xl text-gray-400">logs</h2>
                    <div class="flex-col space-x-4 ">
                        {
                            //logs is array of string, each string is a log item
                            logs?.map(log => {
                                const items = log.split(":");
                                return (
                                    <div className="flex flex-row space-x-4">
                                        <div className="text-gray-400">{new Date(parseInt(items[0])).toLocaleString()}</div>
                                        <div className="text-gray-400">{hashToLogText[items[1]]}</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default ViewLogs;