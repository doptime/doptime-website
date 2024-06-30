import { api, time, Option, scan, zRangeByScore, zRevRangeByScore, lRange, hMGet, rename, type, hKeys, ttl, hGet } from "doptime-client"
import React, { useEffect } from 'react';
import { useState } from 'react';

// const RenameKey = (setSelectedKey, setAllowRename) => {
//     const [newKey, setNewKey] = useState("")
//     return <div class="absolute w-[50%] h-[50%]">
//         <div class="flex flex-row space-x-4">
//             <input type="text" class="flex-nowrap" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
//             <button onClick={() => {
//                 rename(setSelectedKey, newKey).then((res) => {
//                     setSelectedKey(newKey)
//                 })
//             }}>rename</button>
//             {/* canceling rename */}
//             <button onClick={() => {
//                 setAllowRename(false)
//             }
//             }>cancel</button>
//         </div>
//     </div>
// }
const KeyViewerBasicInfo = ({ selectedKey, setSelectedKey, keyType }) => {

    const [allowRename, setAllowRename] = useState(false)
    const [ttlText, setTTL] = useState(0)
    //load key infomation here
    useEffect(() => {
        if (!selectedKey) return
        ttl(selectedKey).then(setTTL)
    }, [selectedKey])
    const inputRef = React.createRef();
    const renameCallback = (e) => {
        if (allowRename && e.target.value !== selectedKey) {
            rename(selectedKey, e.target.value).then((res) => {
                setSelectedKey(e.target.value)
            })
        }
        setAllowRename(false)
    }
    return <div class="flex flex-row space-x-4 w-full p-2 bg-gray-100 rounded">
        <div class="text-lg flex-nowrap"> {keyType?.toUpperCase()}</div>

        {/* display tts */}
        <div>TTL:{ttlText}</div>

        <input type="text" ref={inputRef} class={`w-full rounded px-1 ${allowRename ? " bg-gray-0" : " bg-gray-300"}`} defaultValue={selectedKey}
            onDoubleClick={() => { setAllowRename(true); inputRef.current.focus(); inputRef.current.select(); }}
            onBlur={renameCallback}
            //on key press enter to rename
            onKeyDown={(e) => { if (e.key === 'Enter') renameCallback(e) }}

            readOnly={!allowRename} />

        {
            !allowRename && <div onClick={() => {
                setAllowRename(true); inputRef.current.focus();
                //move cursor to the end of input
                inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length
            }} class="flex-nowrap p-1 whitespace-nowrap "            >✍️ Edit </div>
        }
        <div class="block text-nowrap ring-2 ring-gray-200 bg-slate-300 rounded-lg p-1  hover:bg-slate-400"> ⌫ DEL KEY</div>
    </div>

}
export default KeyViewerBasicInfo