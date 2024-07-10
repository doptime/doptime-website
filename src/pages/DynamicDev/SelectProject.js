import React, { useEffect } from 'react';
import { useState } from 'react';
import Editor, { monaco } from '@monaco-editor/react';
import { apiGetDoptimeToml, keyProjectInfo } from "../MyProjects";


export const SelectProject = ({ curProject, setCurProject }) => {
    const [projectList, setProjectList] = useState({})
    useEffect(() => {
        keyProjectInfo.hGetAll().then((res) => {
            console.log("SelectProjectres", res)
            //if there's only one project, set it as current project
            if (Object.keys(res).length == 1) {
                setCurProject(Object.keys(res)[0])
            }
            setProjectList(res)
        })
        return () => { };
    }, [])
    const [projectToml, setProjectToml] = useState("")
    useEffect(() => {
        apiGetDoptimeToml({ ProjectID: curProject }).then((res) => {
            setProjectToml(res)

            //match SUToken = "*" & setSUToken
            var reg = /SUToken = "(.*)"/
            var matches = res.match(reg)
            if (matches?.length > 1) {
                setSUToken(matches[1])
            }
        })
        return () => { };
    }, [curProject])


    const [suToken, setSUToken] = useState("HboVsNf0bMa1fYq9HXr02SaRD7yz3gyj")

    return (<div class="flex-row  text-gray-400 w-full  p-2 gap-1 ">
        <div class="flex-row  text-gray-400 w-full  p-2 gap-1 ">
            <div class="flex-col w-full" key={projectList?.length}>
                {!!curProject && "Current Project: "}
                {Object.keys(projectList)?.length > 0 &&
                    <select class="text-xl  text-yellow-600 mb-2 ring-1 w-full p-1" value={curProject} onChange={(e) => setCurProject(e.target.value)}>
                        <option value="">Select a Project to Start</option>
                        {Object.keys(projectList).map((key) => <option value={key} >{projectList[key]?.Name}</option>)}
                    </select>
                }

            </div>
            <div class="flex-col w-full">
                {/* // clicket to create a new project */}
                {Object.keys(projectList)?.length == 0 && <button class="bg-blue-500 text-white p-1 flex justify-center self-center rounded-lg leading-4 mx-2 " onClick={() => {
                    //redirect to page :/MyProjects
                    window.location.href = "/MyProjects"
                }}>Create New Project</button>
                }
            </div>

            <div class="flex-col w-full">
                {/* // clicket to create a new project */}
                {suToken.length == 0 && <button class="bg-blue-500 text-white p-1 flex justify-center self-center rounded-lg leading-8 mx-2 px-4  " onClick={() => {
                    //redirect to page :/MyProjects
                    window.location.href = "/MyProjects"
                }}>sutoekn Needed <br></br>set one here...</button>
                }
            </div>
        </div>
    </div>)
}
