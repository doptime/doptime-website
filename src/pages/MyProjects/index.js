import { hashKey, newApi } from 'doptime-client';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Layout from '@theme/Layout';
import { Editor } from '@monaco-editor/react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { h64 } from 'xxhashjs';
import { nanoid } from 'nanoid'
import PathSelector from './pathSelector';


export const keyProjectInfo = new hashKey("ProjectInfo:@ID", { "CreateAt": 0, "EditAt": 0, "ID": "", "Name": "" })

const MyProjectList = ({ doptimeProjects, setDoptimeProjects, curProject, setCurProject }) => {
    const [isEditing, setIsEditing] = useState(false)
    //with fields:{ Name, ID, EditAt}
    const [projectInfo, setProjectInfo] = useState({})

    useEffect(() => {
        keyProjectInfo.hGetAll().then((res) => {
            setDoptimeProjects(res)

            //select the latest edited project as current project
            var latestProjectEditTime = 0, latestProjectID = curProject
            for (var key in res) {
                if (res[key]?.EditAt > latestProjectEditTime) {
                    latestProjectEditTime = res[key]?.EditAt
                    latestProjectID = key
                }
            }
            if (latestProjectEditTime === 0) return
            setCurProject(latestProjectID)
        })
    }, [])
    const CreateNewProject = () => {
        if (!newProjectName) return
        var newProject = { ID: nanoid(10), Name: newProjectName, EditAt: Date.now(), ID: Date.now().toString() }
        keyProjectInfo.hSet(newProject.ID, newProject).then((res) => { })

        var newProjectIDNames = { ...doptimeProjects, [newProject.ID]: newProject }
        setDoptimeProjects(newProjectIDNames)
    }

    useEffect(() => {
        !!curProject && keyProjectInfo.hGet(curProject).then((res) => {
            setProjectInfo(res)
        })
    }, [curProject])
    const [ProjectNameRefreshed, setProjectNameRefreshed] = useState(0)
    const saveCurProjectToRds = (data) => {
        keyProjectInfo.hSet(curProject, data)
    }

    const [newProjectName, setNewProjectName] = useState("")
    return (
        <div className='flex flex-col h-full w-[30%]'>
            <h1>My Projects</h1>
            {/* create new project */}
            <div>
                <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') CreateNewProject() }}
                    placeholder='create a new project, enter to finish' className='w-full h-8 border-2 border-gray-300 rounded-lg p-1 my-2' />
            </div>
            <ul>
                {
                    Object.keys(doptimeProjects).map((ID, index) => <li key={index} onClick={() => setCurProject(ID)}>
                        <div className='flex flex-row justify-between items-center p-1 border-b-2 border-gray-300 hover:bg-gray-200 cursor-pointer'
                        >
                            <div className='text-3xl mr-1 w-fit'>🗂️</div>
                            <div className='flex flex-col w-[80%] h-[10%] bg-gray-200 p-1 leading-2 cursor-pointer hover:bg-gray-300 rounded '                            >
                                {!isEditing && <div className='flex flex-row w-full h-[10%] bg-gray-200 p-1 leading-2  gap-2 justify-between ' onClick={e => setIsEditing(true)} >{doptimeProjects[ID]?.Name}</div>}
                                {isEditing && <div className='flex flex-row w-full h-[10%] bg-gray-200 p-1 leading-2  gap-2 justify-between'>
                                    {/* style header1, click to edit the project name, enter to save */}
                                    <div className=' w-full h-full whitespace-nowrap flex flex-row ' onClick={() => setIsEditing(true)}            >
                                        {isEditing && <input type="text" className={'h-8  border-gray-300 rounded-lg w-full px-1 text-lg '}
                                            value={doptimeProjects[curProject]?.Name}
                                            onChange={(e) => {
                                                doptimeProjects[curProject].Name = e.target.value
                                                setProjectInfo({ ...doptimeProjects })

                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    saveCurProjectToRds(doptimeProjects[curProject])
                                                    setIsEditing(false)
                                                } else if (e.key === 'Escape') {
                                                    setIsEditing(false)
                                                }
                                            }}
                                            onBlur={(e) => { saveCurProjectToRds(doptimeProjects[curProject]), setIsEditing(false); e.stopPropagation(); e.preventDefault(); }}
                                        />
                                        }
                                        {!isEditing && <div className='text-3xl'>{doptimeProjects[curProject]?.Name}</div>}

                                    </div>
                                </div >
                                }
                            </div>
                            {!isEditing && <div className='px-1'>{new Date(parseInt(doptimeProjects[ID]?.CreateAt)).toLocaleString().split(",")[0]}</div>}
                        </div>
                    </li>)
                }
            </ul>

        </div>
    )
}
export const apiGetDoptimeToml = newApi("GetProjectToml", { ProjectID: "" })
var apiSetDoptimeToml = newApi("SetProjectToml", { ProjectID: "", ProjectToml: "" })
const ConfigureTomlEditor = ({ curProject, unsavedFile, setUnsavedFile, panelStayAt }) => {
    const [toml, setToml] = useState(null)
    const [savedtomlHash, setSavedTomlHash] = useState(null)
    useEffect(() => {
        !!curProject && apiGetDoptimeToml({ ProjectID: curProject.toString() }).then((res) => {
            setSavedTomlHash(res)
            setToml(res)
        })
    }, [curProject])

    //auto save every 5 seconds
    useEffect(() => {
        //list to the key event, if press ctrl+s, or cmd+s save the file
        var event_keydown = document.addEventListener("keydown", (e) => {
            if (e.key === 's' && (e.ctrlKey || e.metaKey) && panelStayAt == "tomlfile") {
                if (toml === savedtomlHash) return
                apiSetDoptimeToml({ ProjectID: curProject.toString(), ProjectToml: toml }).then((res) => null)
                setSavedTomlHash(toml)
                e.preventDefault()
            }
        })
        return () => {
            document.removeEventListener("keydown", event_keydown)
        }
    }, [curProject, toml, savedtomlHash, panelStayAt])
    //tell the user the file is unsaved
    useEffect(() => {
        setUnsavedFile({ ...unsavedFile, [curProject]: toml !== savedtomlHash })
    }, [toml, savedtomlHash])

    return <Editor height="70vh"
        defaultLanguage="toml"
        defaultValue={toml}
        value={toml}
        onChange={(e) => setToml(e)}
        onMount={e => null}

    />
}
const MyProjects = () => {
    const [curProject, setCurProject] = useState("")
    const [unsavedFile, setUnsavedFile] = useState({})
    const [doptimeProjects, setDoptimeProjects] = useState({})
    //tomlfile, ProjectInfo, ProjectPathInfo    
    const [panelStayAt, setPanelStayAt] = useState("tomlfile")
    return <Layout >
        <div className='flex flex-row w-full h-full gap-1'>

            <MyProjectList curProject={curProject} setCurProject={setCurProject} doptimeProjects={doptimeProjects} setDoptimeProjects={setDoptimeProjects} />

            <div className='flex flex-col h-full w-[70%]'>
                <div className='flex flex-row text-xl gap-2 bg-gray-100 p-1'>
                    <div className={`${panelStayAt === "tomlfile" ? " bg-blue-300" : "bg-gray-300"} w-fit rounded-lg px-4`} onClick={() => setPanelStayAt("tomlfile")}                    >
                        Toml Editor {!!unsavedFile[curProject] && " ⚪"}
                    </div>
                    <div className={`${panelStayAt === "ProjectPathInfo" ? " bg-blue-300" : "bg-gray-300"} w-fit rounded-lg px-4`} onClick={() => setPanelStayAt("ProjectPathInfo")}                    >
                        Sub Projects
                    </div>
                </div>
                {panelStayAt === "tomlfile" && <ConfigureTomlEditor curProject={curProject} unsavedFile={unsavedFile} setUnsavedFile={setUnsavedFile} panelStayAt={panelStayAt} />}
                {panelStayAt === "ProjectPathInfo" && <PathSelector curProject={curProject} unsavedFile={unsavedFile} setUnsavedFile={setUnsavedFile} panelStayAt={panelStayAt} />}
            </div>
        </div>

    </Layout>

}
export default MyProjects;