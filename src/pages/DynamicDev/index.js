import { newApi, Option } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import Editor, { monaco } from '@monaco-editor/react';
import Layout from "@theme/Layout";
import { apiGetDoptimeToml, keyProjectInfo } from "../MyProjects";
import { keySubProjectIterator } from "../MyProjects/pathSelector";
import { SelectProject } from "../../components/Project/SelectProject";
import { FocusedDocWithBackgroundFilesToIterate, SelectRelatedFiles } from "./prompts";

//var apiGetProjectArchitectureInfo = newApi("getProjectArchitectureInfo", { "ProjectDir": "", "SkipFiles": [], "SkipDirs": [] },)
var apiGetProjectArchitectureInfo = newApi("getProjectArchitectureInfo", { in: { "IncludedFileExts": [""], "ProjectDir": "", "SkipDirs": [""], "SkipFiles": [""] }, out: { "AbsPath": "", "RelFile2Arch": { "exampleKey": "" } } })

var apiCodeGet = newApi("codeGet", { in: { "FileName": "" }, out: { "SourceCode": "" } })


const DynDev = () => {
    //[{basepath, path, arch,catalogue}]
    const [architectInfos, setArchitectInfos] = useState([])
    //use architectureLast  to prevent architectInfos update latency
    const architectureLast = []
    const [sourceCodes, setSourceCodes] = useState({})
    const [selectedFile, setSelectedFile] = useState("")
    // case file prompt 
    const [stopAt, setStopAt] = useState("")
    const stopAtVal = { file: "file", prompt: "prompt" }


    const [curProject, setCurProject] = useState("")
    useEffect(() => {
        if (!curProject) return
        keySubProjectIterator.hScan(0, `${curProject}*`, 2048).then((res) => {
            for (var i = 0; i < res?.values.length; i++) {
                let catalogue = i
                var item = res?.values[i]

                apiGetProjectArchitectureInfo({ "ProjectDir": item.RootPath, "SkipDirs": item.SkipDirs?.split("\n"), "SkipFiles": item.SkipFiles?.split("\n") }).then((res) => {
                    if (typeof res == "object") {
                        Object.entries(res?.RelFile2Arch ?? {}).forEach(([RelFile, arch]) => architectureLast.push({ AbsPath: res.AbsPath, RelFile: RelFile, arch, catalogue, fullname: res.AbsPath + RelFile }))
                        setArchitectInfos([...architectureLast])
                        //console.log("architectInfos", architectureLast)
                        setStopAt(stopAtVal.file)
                    }
                })
            }

        });
        return () => { };
    }, [curProject])

    useEffect(() => {
        !!selectedFile && apiCodeGet({ "FileName": selectedFile ?? "" }).then((res) => {
            if (!res.SourceCode?.length > 0) return
            var newSourceCode = { ...sourceCodes }
            newSourceCode[selectedFile] = res?.SourceCode
            setSourceCodes(newSourceCode)
        })
        return () => { };
    }, [selectedFile])
    const cssSelectedLabelWithYellowBoundaryLineOnTop = (myPos) => stopAt == myPos && "border-t-2 border-yellow-500 bg-blue-500"

    const [prompt, setPrompt] = useState("")
    return <Layout>
        {/* using postcss-nested https://farer.org/2021/10/08/docusaurus-with-tailwindcss/ */}
        <div class="flex flex-row px-1 w-full h-full gap-2" >
            <div key="PackageView" class="flex-col w-[29%] h-full">

                <SelectProject curProject={curProject} setCurProject={setCurProject} />
                <div class="flex-col  whitespace-nowrap ">Package View</div>
                <div class="flex flex-col overflow-y-scroll h-[80vh] overflow-scroll " key={architectInfos?.length}>
                    {
                        //{basepath, path, arch,catalogue}
                        architectInfos?.map((item) => <div class={`flex-row p-1 gap-1 ${selectedFile == item.fullname ? " bg-blue-200 text-white rounded-xl" : " text-gray-400"}
                            ${["bg-blue-50", "bg-green-50"][item.catalogue % 2]}`}
                            onClick={() => {
                                setStopAt("file")
                                setSelectedFile(item.fullname)
                            }}
                        > {item.RelFile}
                        </div>
                        )
                    }
                </div>
            </div>


            <div key="rightPanel" class="flex-col w-full h-full"            >
                <div class="flex flex-row gap-2 w-full h-[3vh]" >

                    <div class={`bg-blue-200 text - white ${cssSelectedLabelWithYellowBoundaryLineOnTop("file")} px-2  rounded
                    `} onClick={() => { setStopAt("file") }}>File </div>

                    <div class={`bg-blue-200 text - white ${cssSelectedLabelWithYellowBoundaryLineOnTop("RelatedFiles")} px-2  rounded`} onClick={() => {

                        //CO-STAR framework Context & Objective- Style -Tone - Audience - Response
                        setPrompt(SelectRelatedFiles(architectInfos, selectedFile, sourceCodes))

                        setStopAt("RelatedFiles")
                    }} >SelectRelatedFiles</div>

                    <div class={`bg-blue-200 text - white ${cssSelectedLabelWithYellowBoundaryLineOnTop("prompt")} px-2  rounded`} onClick={() => {

                        //CO-STAR framework Context & Objective- Style -Tone - Audience - Response
                        setPrompt(FocusedDocWithBackgroundFilesToIterate(architectInfos, selectedFile, sourceCodes))

                        setStopAt("prompt")
                    }} >Prompt</div>

                    <button class="bg-blue-500 text-white p-1 flex justify-center self-center rounded-lg leading-4 mx-2 px-2  " onClick={() => {
                        // api("GET", "/api/packinfo", { "packname": "doptime" }, (res) => {
                        //     setArchitectInfos(res)
                        // })
                    }}>Iterate MCTS</button>
                </div>
                <div class="flex-col gap-1 w-full overflow-y-auto p-1 bg-gray-100 rounded-xl">
                    {stopAt == "file" && <div>
                        <div>{selectedFile}</div>
                        <Editor
                            height="95vh"
                            defaultLanguage="go"
                            defaultValue={!!selectedFile && sourceCodes[selectedFile]}
                            value={!!selectedFile && sourceCodes[selectedFile]}
                            onMount={e => null}

                        />
                    </div>
                    }

                    {stopAt == "RelatedFiles" && <Editor
                        height="95vh"
                        defaultLanguage="text"
                        defaultValue={!!selectedFile && sourceCodes[selectedFile]}
                        value={prompt}
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
    </Layout>
}
export default DynDev;