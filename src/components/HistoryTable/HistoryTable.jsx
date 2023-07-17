import './HistoryTable.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const HistoryTable = () => {

    const data = [
        { name: '1', date: '2021-10-10', status: 'Approved' },
        { name: '2', date: '2021-10-10', status: 'Pending' },
        { name: '3', date: '2021-10-10', status: 'Approved' },
        { name: '4', date: '2021-10-10', status: 'Pending' },
        { name: '5', date: '2021-10-10', status: 'Approved' },
        { name: '6', date: '2021-10-10', status: 'Pending' },
    ]

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData.status === 'Approved' ?

                    <span className="status-approved">{rowData.status}</span>
                    :
                    <span className="status-pending">{rowData.status}</span>
                }
            </div>
        );
    }

    const header = (
        <div className="table-header">
            HELLO
        </div>
    );


    return (
        <>
            <div className="historyTable">
                <DataTable header={header} value={data} stripedRows paginator sortMode="multiple" rows={5} rowsPerPageOptions={[5, 10]} size="large">
                    <Column align="center" field="name" header="PostID"></Column>
                    <Column align="center" field="name" header="Name" sortable></Column>
                    <Column align="center" field="date" header="Date" sortable></Column>
                    <Column align="center" field="status" header="Status" body={statusTemplate} sortable></Column>
                </DataTable>
            </div>
        </>
    );
}

export default HistoryTable;