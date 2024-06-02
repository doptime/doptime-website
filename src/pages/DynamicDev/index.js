import { api, configure, time, Option, scan, zRangeByScore, zRevRangeByScore, setDefaultSUToken, lRange, hMGet, rename, type, hKeys, ttl, hGet } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import Editor, { monaco } from '@monaco-editor/react';

const DynamicDevelopProjects = () => {
    const [urlBase, setUrlbase] = useState("https://api.doptime.com")
    const [suToken, setSUToken] = useState("HboVsNf0bMa1fYq9HXr02SaRD7yz3gyj")
    const [ProjectNames, setProjectNames] = useState([])
    const [BasePath, setBasePath] = useState("")
}


const DynDev = () => {

    //const [urlBase, setUrlbase] = useState("https://api.doptime.com")
    const [urlBase, setUrlbase] = useState("http://localhost:80")
    const [suToken, setSUToken] = useState("HboVsNf0bMa1fYq9HXr02SaRD7yz3gyj")
    //with key the file name, value the golang architecture info
    const [architectInfos, setArchitectInfos] = useState({})
    const architectureLast = {}
    const [sourceCodes, setSourceCodes] = useState({})
    const [selectedFile, setSelectedFile] = useState("")
    // case file prompt 
    const [stopAt, setStopAt] = useState("")
    const stopAtVal = { file: "file", prompt: "prompt" }
    setDefaultSUToken(suToken)
    configure(urlBase, "", (err) => {
    })
    useEffect(() => {
        // api("getProjectArchitectureInfo", { "ProjectDir": "", "SkipDirs": [".git", ".vscode", ".DS_Store"] },).then((res) => {
        //     if (typeof res == "object") {
        //         var BasePath = res.BasePath
        //         for (var key in res.RelName2Arch) {
        //             var item = { path: BasePath + key, arch: res.RelName2Arch[key], catalogue: 0 }
        //             architectureLast[key] = item
        //         }
        //         setArchitectInfos({ ...architectureLast })
        //         setStopAt(stopAtVal.prompt)
        //     }
        // })
        api("getProjectArchitectureInfo", { "ProjectDir": "/Users/yang/doptime/doptime", "SkipDirs": [".git", ".vscode", ".DS_Store", "3rd_lang", "test"] },).then((res) => {
            if (typeof res == "object") {
                var BasePath = res.BasePath
                for (var key in res.RelName2Arch) {
                    var item = { path: BasePath + key, arch: res.RelName2Arch[key], catalogue: 0 }
                    architectureLast[key] = item
                }
                setArchitectInfos({ ...architectureLast })
                setStopAt(stopAtVal.prompt)
            }
        })

        api("getProjectArchitectureInfo", {
            "ProjectDir": "/Users/yang/doptime/doptime-website", "SkipDirs": [".git", ".DS_Store", ".docusaurus", "i18n", "blog", "src", "static"],
            "SkipFiles": ["docusaurus.config.js", "package.json", "package-lock.json", "12db-setting-up.md", "tailwind.config.js", "postcss.config.js", "sidebars.js", "babel.config.js"]
        }).then((res) => {
            if (typeof res == "object") {
                var BasePath = res.BasePath
                for (var key in res.RelName2Arch) {
                    var item = { path: BasePath + key, arch: res.RelName2Arch[key], catalogue: 1 }
                    architectureLast[key] = item
                }
                setArchitectInfos({ ...architectureLast })
                setStopAt(stopAtVal.prompt)
            }
        })

        return () => { };
    }, [])
    useEffect(() => {
        !!selectedFile && api("codeGet", { "FileName": selectedFile || "" },).then((res) => {
            if (!res.SourceCode?.length > 0) return
            var newSourceCode = { ...sourceCodes }
            newSourceCode[selectedFile] = res?.SourceCode
            setSourceCodes(newSourceCode)
        })
        return () => { };
    }, [selectedFile])
    const cssSelectedLabelWithYellowBoundaryLineOnTop = (myPos) => stopAt == myPos && "border-t-2 border-yellow-500 bg-blue-500"

    const [prompt, setPrompt] = useState("")
    //CO-STAR framework Context & Objective- Style -Tone - Audience - Response
    useEffect(() => {
        var concisedVersionOfCodes = ""
        for (var key in architectInfos) {
            concisedVersionOfCodes += "\n;---" + key + "---\n" + architectInfos[key].arch
        }
        var FocusedCode = !!selectedFile && "\n;---foucued-document:" + selectedFile + "---\n" + sourceCodes[selectedFile]
        // 1.	需求分析：定义项目的核心需求和目标，明确哪些功能是必需的，哪些是次要的。
        // 2.	代码评审：逐段分析现有代码，找出错误和不合理之处。
        // 3.	模块化改进：逐个模块进行改进，每次只改动一小部分，确保改动可控。
        setPrompt(`you are Context-Object driven document/sourcecode iterator;
project context & objects are given by concised version of files. there's one focused document at the end of the prompt to iterate;
your Object is to check the focused document and iterately renew the document, keeping global vision of the project & even the world in mind, to minimize the information uncentainty in Information Theory way;

;That is, you are expected to do following actions:
1. collect & explain the Core Requirment of current document,  what is user need, what is of vital importance;
2. point out the errors & unreasonable parts of the focused document, or the neccessity to smooth information by refactor the focused document to make it more understandable & reasonable
4. iterate the focused document,  with miminal change a to the document to make the change controllable 
5. after iteration, raise a question , the answer of which could lead to maximize the information gain of the project, or minimize the uncentainty of the project
; 
output style: 
<step1>:
explaination of the core requirment of the document

<step2>:
errors & unreasonable parts of the document or requrement to refactor the document

<step3>:
new iteration of the document

<step4>:
important question to raise after iteration
<stepEnd>
;

; finally you are expected to do 1 or multiple following actions:
    - choose one document file to focus on which could lead to maximize the information gain of the project, by saying :
focus_on: <filename>
    - remove file that could minimize infomation conflict, by saying 
remove_file: <filename>
    - create file that could maximize infomation gain, by saying 
create_file: <filename>"
;

;
this is a demo document you are expected to receive or response, with meta info given in comments in front part in each document:
// 
// Context from the role of  Product Manager :
// - summarazation of market needs and user needs 
// - ✅ vision of the product。 with tag ✅ if accepted by human; else ❓
// ❓assumption meta info, generated by llm, to be accepted or modified by human product manager
// 

// - object to do
// -- object description

// Log of Last Iteration output:


// - object QA Engineer needs to do
// -- object description
// -- object status do do,caceled, dones
package ...
;



`+ concisedVersionOfCodes
            + FocusedCode)
        return () => { };
    }, [selectedFile, sourceCodes])

    return (
        // using postcss-nested https://farer.org/2021/10/08/docusaurus-with-tailwindcss/
        <div class="flex flex-row px-1 w-full h-full gap-2" >
            <div key="PackageView" class="flex-col w-[29%]">

                <div class="flex-row  text-gray-400 w-full  p-2 gap-1 ">
                    <div class="flex-col w-full">
                        <div class="text-lg">HTTP Endpoint</div>
                        <input class="text-xl  text-yellow-600 mb-2 ring-1 w-full p-1" type="text" value={urlBase} onChange={(e) => setUrlbase(e.target.value)} />
                    </div>
                    <div class="flex-col w-full ">
                        <div class="text-lg">SUToken:</div>
                        <input class="text-xl  text-yellow-600 mb-2 ring-1 w-full p-1" type="text" value={suToken} onChange={(e) => setSUToken(e.target.value)} />
                    </div>
                </div>


                <div class="flex-col  whitespace-nowrap ">Package View</div>
                <div>
                    {
                        Object.keys(architectInfos).map((relapath) => <div class={`flex-row p-1 gap-1 ${selectedFile == relapath ? " bg-blue-200 text-white rounded-xl" : " text-gray-400"} 
                        ${["bg-blue-50", "bg-green-50"][architectInfos[relapath].catalogue]}`}
                            onClick={() => {
                                setStopAt("file")
                                setSelectedFile(architectInfos[relapath].path)
                            }}
                        > {relapath}
                        </div>
                        )
                    }
                </div>
            </div>


            <div key="rightPanel" class="flex-col w-full h-full"            >
                <div class="flex flex-row gap-1 w-full h-[3vh] " >

                    <div class={`bg-blue-200 text-white ${cssSelectedLabelWithYellowBoundaryLineOnTop("file")}`} onClick={() => { setStopAt("file") }}>Focusing: {selectedFile || "None"} </div>
                    <div class={`bg-blue-200 text-white ${cssSelectedLabelWithYellowBoundaryLineOnTop("prompt")}`} onClick={() => { setStopAt("prompt") }} >Prompt</div>

                    <button class="bg-blue-500 text-white p-1 flex justify-center self-center rounded-lg leading-4 mx-2 " onClick={() => {
                        api("GET", "/api/packinfo", { "packname": "doptime" }, (res) => {
                            setArchitectInfos(res)
                        })
                    }}>Iterate MCTS</button>
                </div>
                <div class="flex-col gap-1 w-full overflow-y-auto p-1 bg-gray-100 rounded-xl">
                    {stopAt == "file" && <Editor
                        height="95vh"
                        defaultLanguage="go"
                        defaultValue={!!selectedFile && sourceCodes[selectedFile]}
                        value={!!selectedFile && sourceCodes[selectedFile]}
                        onMount={e => null}

                    />}

                    {stopAt == "prompt" && <Editor
                        height="95vh"
                        defaultLanguage="text"
                        defaultValue={!!selectedFile && sourceCodes[selectedFile]}
                        value={prompt}
                        onMount={e => null}

                    />}
                </div>

            </div>

        </div>
    )
}
export default DynDev;