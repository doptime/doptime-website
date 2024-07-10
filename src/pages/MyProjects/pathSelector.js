import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { nanoid } from 'nanoid';
import { hKey, newApi } from 'doptime-client';


export const keySubProjectIterator = new hKey("SubProjectIterator:@ID", { "CreateAt": 0, "EditAt": 0, "SkipFiles": "", "ID": "", "SkipDirs": "", "RootPath": "" })
const PathSelector = ({ curProject, unsavedFile, setUnsavedFile, panelStayAt }) => {

    useEffect(() => {
        if (!curProject) return;
        keySubProjectIterator.hScan(0, `${curProject}*`, 2048).then((res) => setRowData(res?.values ?? []));
    }, [curProject]);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);
    if (!Array.isArray(rowData)) {
        setRowData([]);
    }

    const deleteSelectedRows = (props) => {
        const newRowData = rowData.filter(row => row.ID !== props.data.ID);
        setRowData(newRowData);
        keySubProjectIterator.hDel(props.data.ID);
    };

    const ActionCellRenderer = (props) => <div className='flex flex-col justify-center h-full'>
        <button className='bg-blue-500 text-white p-1 rounded-lg cursor-pointer hover:bg-red-600 px-2'
            onClick={() => deleteSelectedRows(props)}>Del</button>
    </div>

    const MultilineCellRenderer = (props) => <div className='flex items-center p-1   rounded-lg bg-gray-0  h-full w-full whitespace-pre-wrap leading-tight'>
        {props.value}
    </div>

    // Column Definitions: Defines the columns to be displayed.
    //agLargeTextCellEditor should enable multi-line text editing,and display multi-line text in the cell
    const [colDefs, setColDefs] = useState([
        { field: "RootPath", cellRenderer: 'actionCellRenderer', cellRenderer: MultilineCellRenderer, editable: true, maxWidth: 150 },
        { field: "SkipDirs", editable: true, cellEditor: 'agLargeTextCellEditor', cellRenderer: MultilineCellRenderer, autoHeight: true },
        { field: "SkipFiles", editable: true, cellEditor: 'agLargeTextCellEditor', cellRenderer: MultilineCellRenderer, autoHeight: true },
        {
            field: "CreateAt", valueFormatter: p => {
                return new Date(p.data.CreateAt).toLocaleString().split(",")[0];
            }, width: 120, maxWidth: 200
        },
        { field: "Action", cellRenderer: ActionCellRenderer, maxWidth: 80 },
    ]);


    let gridApi;

    return (
        <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <div className='flex flex-row justify-end items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-gray-300 w-full'
                onClick={() => {
                    var newRowData = [{ ID: `${curProject}_${nanoid(7)}`, CreateAt: new Date().getTime(), RootPath: "", SkipFiles: "", SkipDirs: "" }, ...rowData];
                    setRowData(newRowData);
                }}>
                <div className='bg-blue-500 text-white p-1 rounded-lg cursor-pointer hover:bg-red-600 px-2'>
                    Add a new sub project
                </div>
            </div>
            <div style={{ height: 'calc(100vh - 160px)' }}>
                <AgGridReact key={rowData}
                    rowData={rowData}
                    columnDefs={colDefs}
                    onGridReady={(params) => {
                        gridApi = params.api;
                        params.api.sizeColumnsToFit();
                    }}
                    rowModelType='clientSide'
                    rowHeight={200}
                    onCellEditingStopped={(event) => {
                        var data = {
                            "CreateAt": event.data.CreateAt,
                            "RootPath": event.data.RootPath,
                            "SkipDirs": event.data.SkipDirs,
                            "SkipFiles": event.data.SkipFiles,
                            "EditAt": new Date().getTime(),
                            "ID": event.data.ID
                        };
                        keySubProjectIterator.hSet(data.ID, data);
                    }}
                />
            </div>
        </div>
    );
}

export default PathSelector;
