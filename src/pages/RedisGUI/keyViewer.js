import { type, hKey, lKey, setKey, xKey, strKey, zKey } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import KeyViewerBasicInfo from "./keyViewerBasicInfo"
var _ = require('lodash');

const KeyViewer = ({ selectedKey, setSelectedKey }) => {
    const pageItemCnt = 20
    const [keyType, setKeyType] = useState("")
    const [shownFieldValues, setShownFieldValues] = useState([])
    //index of row in the current page
    const [selectedInd, setSelectedInd] = useState(0)
    const [currentPageIndB, setCurrentPageIndB] = useState(0)
    const [fieldLength, setFieldLength] = useState(-1)
    //step 0: clear all data
    useEffect(() => {
        //query redis key type
        setKeyType("")
        setShownFieldValues([])
        setFieldLength(0)
        setSelectedInd(0)
        setCurrentPageIndB(0)

    }, [selectedKey])

    //step 1: get key type
    useEffect(() => {
        if (!selectedKey) return
        type(selectedKey).then(setKeyType)
    }, [selectedKey])

    // step 2: get key length
    useEffect(() => {
        if (!keyType || !selectedKey) return
        if (keyType === "hash") new hKey(selectedKey).hLen().then(setFieldLength)
        else if (keyType === "list") new lKey(selectedKey).lLen().then(setFieldLength)
        else if (keyType === "set") new setKey(selectedKey).sCard().then(setFieldLength)
        else if (keyType === "zset") new zKey(selectedKey).zCard().then(setFieldLength)
        else if (keyType === "stream") new xKey(selectedKey).xLen().then(setFieldLength)
        else if (keyType === "string") setFieldLength(1)
    }, [selectedKey, keyType])

    //step 3: get all fields of selected key`   
    useEffect(() => {
        if (!keyType || !selectedKey || fieldLength < 0) return
        const MoveToStartPage = (res) => {
            if (!keyType || !selectedKey || fieldLength < 0) return
            setShownFieldValues(res)
        }

        //get items
        if (keyType === "hash") new hKey(selectedKey).hScan(selectedInd, "*", pageItemCnt).then((res) => setShownFieldValues(_.zip(res["keys"], res["values"])))
        else if (keyType === "list") new lKey(selectedKey).lRange(selectedInd, selectedInd + pageItemCnt).then(MoveToStartPage)
        else if (keyType === "set") new setKey(selectedKey).sScan(selectedInd, "*", pageItemCnt).then(res => {
            var keys = res["keys"], cursor = res["cursor"]
            var res = []
            for (var i = 0; i < keys.length; i++) res.push([keys[i]])
            MoveToStartPage(res)
        })
        else if (keyType === "zset") new zKey(selectedKey).zRange(selectedInd, selectedInd + pageItemCnt, true).then(res => {
            var members = res["members"], scores = res["scores"]
            var res = []
            for (var i = 0; i < members.length; i++) res.push([members[i], scores[i]])
            MoveToStartPage(res)
        })
        else if (keyType === "string") new strKey(selectedKey).get().then(res => MoveToStartPage([[selectedKey, res]]))
        else if (keyType == "stream") new xKey(selectedKey).xRangeN("-", "+", pageItemCnt).then(res => {
            console.log("xRangeN", res)
            var members = []
            for (var i = 0; i < res.length; i++) members.push([res[i]?.ID, res[i]?.Values])
            MoveToStartPage(members)
        })

    }, [selectedKey, keyType, fieldLength])



    const deleteRow = (key) => {
        //delete key
        // hDel(selectedKey, key).then((res) => {
        //     //refresh
        //     hKeys(selectedKey).then((res) => {
        //         setAllFields(res)
        //         setCurrentPage(0)
        //         setSelectedField(res[0])
        //     })
        // })
    }
    const addItem = () => {
        //add key
        // hSet(selectedKey, "newkey", "newvalue").then((res) => {
        //     //refresh
        //     hKeys(selectedKey).then((res) => {
        //         setAllFields(res)
        //         setCurrentPage(0)
        //         setSelectedField(res[0])
        //     })
        // })
    }


    return <div class="flex-col w-full" key={selectedKey}>
        <KeyViewerBasicInfo selectedKey={selectedKey} setSelectedKey={setSelectedKey} keyType={keyType} setKeyType={setKeyType} />

        {/* key item short notes */}
        <div class="flex flex-row space-x-4 w-full">
            <div class="text-lg w-9/12">
                {
                    shownFieldValues?.map((kv, index) => {
                        return <div class={`flex flex-row space-x-4 ${index === selectedInd && " bg-yellow-200 rounded-lg"}`} onClick={() => {
                            setSelectedInd(index)
                        }} key={index}>
                            <div>{index + selectedInd}</div>
                            <div>{JSON.stringify(kv[0])}</div>
                        </div>
                    })
                }
            </div>
            <div class="flex flex-col space-y-2 w-3/12">
                <div class={"w-full h-full flex-col space-y-2 flex justify-between"} >
                    <div class="ring-1 bg-gray-200 rounded-md  p-1 px-3 " onClick={() => deleteRow(addItem)}>
                        <div class=" whitespace-nowrap text-nowrap flex justify-between  w-fit gap-4">
                            <div class=" text-xl"> ➕</div>  Add Item
                        </div>
                    </div>
                    <div class="ring-1 bg-gray-200 rounded-md  p-1 px-3 " onClick={() => deleteRow(selectedField)}>
                        <div class=" whitespace-nowrap text-nowrap flex justify-between  w-fit gap-4">
                            <div class=" text-xl"> ⌫</div>  Del Row
                        </div>
                    </div>
                    <div class="ring-1 bg-gray-200 rounded-md  p-1 px-3 " onClick={() => deleteRow(selectedField)}>
                        <div class=" whitespace-nowrap text-nowrap flex justify-between  w-fit gap-4">
                            <div class=" text-xl">↺</div>  Reload
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        {/* Other elements */}
                        <div className="flex flex-grow w-full ">

                        </div>
                    </div>

                    <div class=" whitespace-nowrap text-nowrap flex justify-between " >
                        <input type="text" class="ring-1 bg-gray-200 rounded-md  p-1 px-3  w-24"
                            value={currentPageIndB / pageItemCnt} onChange={(e) => {
                                var page = e.target.value
                                var maxPage = ((shownFieldValues?.length - 1) / pageItemCnt) << 0
                                if (page > maxPage) {
                                    page = maxPage
                                }
                                setCurrentPageIndB(page * pageItemCnt)
                            }} /> 页 /{((shownFieldValues?.length + pageItemCnt - 1) / pageItemCnt) << 0} 页
                    </div>
                    <div>{currentPageIndB + " / " + fieldLength + " items in total"}</div>

                    <div class="flex-row w-full flex justify-between pb-2"> {/* Modify this line */}
                        <button class={"ring-1 bg-gray-200 rounded-md p-1 px-3 " + (currentPageIndB <= 0 && " text-gray-500")} onClick={() => {
                            setCurrentPageIndB(currentPageIndB - pageItemCnt)
                        }} disabled={currentPageIndB <= 0}
                        >prev</button>
                        <button class={"ring-1 bg-gray-200 rounded-md  p-1 px-3 " + (currentPageIndB + pageItemCnt >= shownFieldValues?.length && " text-gray-500")} onClick={() => {
                            setCurrentPageIndB(currentPageIndB + pageItemCnt)
                        }} disabled={currentPageIndB + pageItemCnt >= shownFieldValues?.length}
                        >next</button>
                    </div>
                </div>
            </div>
        </div>
        {/* //horizontal line */}
        <div class="w-full h-1 bg-gray-200"></div>

        {/* full display of single key value */}
        <div class="flex flex-col space-x-4 w-full h-full">
            {
                JSON.stringify(shownFieldValues[selectedInd]?.[1])
            }
        </div>

    </div>
}
export default KeyViewer;