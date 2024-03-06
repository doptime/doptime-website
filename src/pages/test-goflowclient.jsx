
import React, { useState } from 'react';
import { GlobalConfig, hGet } from 'goflowclient';

export default function TestGoFlowClient() {
    GlobalConfig("https://default.goflow.cc", "", "")
    const [hgetResult, setHgetResult] = useState("");
    const handleClick = async () => {
        hGet('test_h_demo', "who am i").then(res => {
            setHgetResult(res);
        }).catch(err => {
            setHgetResult("error" + err);
        });
        console.log(res);
    };
    return (
        <div >
            <button onClick={handleClick}>Test GoFlow Client</button>

            <p>{hgetResult || "hget result not received"}</p>
        </div>
    );
}