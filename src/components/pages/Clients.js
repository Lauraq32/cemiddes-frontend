import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import axios from 'axios';
import headers from '../service/token';

const formatDate = (value) => {
    return new Date (value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const Clients = () => {
    let emptyClient = {
        _id: null,
        paciente: '',
        tratamiento: '',
        fecha: formatDate(Date.now()),
        doctora:'',
        numeromovil: '',
        visitasdelpaciente:''
    };

    const [clients, setClients] = useState(null);
    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteClientDialog] = useState(false);
    const [deleteClientsDialog, setDeleteClientsDialog] = useState(false);
    const [client, setClient] = useState(emptyClient);
    const [selectedClients, setSelectedClients] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        // const clientService = new ClientService();
        // clientService.getClients().then(data => setClients(data));
        getAllClients();

    }, []);

    const getAllClients = () => {
        axios.get("http://localhost:8080/api/clientes/todos", {headers})
        .then((response) => {
            const allClients = response.data.clientes;
            console.log(allClients);
            setClients(allClients);
            //console.log(response);
        })
        .catch(error => console.error('Error: ${error}'));
    }



    const openNew = () => {
        setClient(emptyClient);
        setSubmitted(false);
        setClientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
    }

    const hideDeleteClientDialog = () => {
        setDeleteClientDialog(false);
    }

    const hideDeleteClientsDialog = () => {
        setDeleteClientsDialog(false);
    }

    const saveClient = () => {
        setSubmitted(true);

        if (client.paciente.trim()) {
            let _clients = [...clients];
            let _client = { ...client };
            if (client._id) {
                axios.put('http://localhost:8080/api/clientes/update/' + _client._id, _client , {headers}, )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
                    getAllClients();

                })
                .catch(error => console.error('Error while adding client:',error));
            }
            else {
                axios.post("http://localhost:8080/api/clientes/nuevo", _client, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Added', life: 3000 });
                    getAllClients();
                })
                .catch(error => console.error('Error while posting client',error));
            }

            setClients(_clients);
            setClientDialog(false);
            setClient(emptyClient);
        }
    }

    const editClient = (client) => {
        setClient({ ...client });
        setClientDialog(true);
    }

    const confirmDeleteClient = (client) => {
        setClient(client);
        setDeleteClientDialog(true);
    }

    const deleteClient = () => {
        let _clients = clients.filter(val => val._id !== client._id);
        setClients(_clients);
        setDeleteClientDialog(false);
        setClient(emptyClient);
        axios.delete('http://localhost:8080/api/clientes/delete/' + client._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in editProduct:',error));
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteClientsDialog(true);
    }

    const deleteSelectedClients = () => {
        let _clients = clients.filter(val => !selectedClients.includes(val));
        setClients(_clients);
        setDeleteClientsDialog(false);
        setSelectedClients(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
    }

    const onCalenderChange = (e, paciente) => {
        const val = e.value || 0;
        let _client = { ...client };
        _client[`${paciente}`] = val;
        e.preventDefault();
        setClient(_client);
    }

    const onInputChange = (e, paciente) => {
        const val = (e.target && e.target.value) || '';
        let _client = { ...client };
        _client[`${paciente}`] = val;

        setClient(_client);
    }

    const onInputNumberChange = (e, paciente) => {
        const val = e.value || 0;
        let _client = { ...client };
        _client[`${paciente}`] = val;

        setClient(_client);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedClients || !selectedClients.length} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="doc/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre del Paciente</span>
                {rowData.paciente}
            </>
        );
    }

    const treatmentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tratamiento</span>
                {rowData.tratamiento}
            </>
        );
    }

    const doctorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Doctora</span>
                {rowData.doctora}
            </>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha</span>
                {/* {formatDate(rowData.fecha)} */}
                {formatDate(rowData.fecha)}

            </>
        );
    }

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Numeromovil</span>
                {rowData.numeromovil}
            </>
        );
    }
    
    const visitsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Visitas del Paciente</span>
                {rowData.visitasdelpaciente}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editClient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteClient(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const clientDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClient} />
        </>
    );
    const deleteClientDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteClient} />
        </>
    );
    const deleteClientsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClients} />
        </>
    );

    return (
        <div className="grid clients-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={clients} selection={selectedClients} onSelectionChange={(e) => setSelectedClients(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} clientes"
                        globalFilter={globalFilter} emptyMessage="No se encontraron clientes." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="paciente" header="Nombre del Paciente" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="tratamiento" header="Tratamiento" sortable body={treatmentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="doctora" header="Doctora" sortable body={doctorBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="fecha" header="Fecha" sortable body={dateBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="numeromovil" header="Numeromovil" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="visitasdelpaciente" header="Visitas del Paciente" sortable body={visitsBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '450px' }} header="Client Details" modal className="p-fluid" footer={clientDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="paciente">Nombre del Paciente</label>
                            <InputText id="paciente" value={client.paciente} onChange={(e) => onInputChange(e, 'paciente')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.paciente })} />
                            {submitted && !client.paciente && <small className="p-invalid">el nombre del paciente es necesario</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="tratamiento">Tratamiento</label>
                            <InputText id="tratamiento" value={client.tratamiento} onChange={(e) => onInputChange(e, 'tratamiento')} required className={classNames({ 'p-invalid': submitted && !client.tratamiento })} />
                            {submitted && !client.tratamiento && <small className="p-invalid">se necesita agregar el tratamiento</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="doctora">Doctora</label>
                            <InputText id="doctora" value={client.doctora} onChange={(e) => onInputChange(e, 'doctora')} required className={classNames({ 'p-invalid': submitted && !client.doctora })} />
                            {submitted && !client.doctora && <small className="p-invalid">el nombre de la doctora es necesario</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="fecha">Fecha</label>
                                <Calendar id="fecha" value={formatDate(client.fecha)}  onChange={(e) => onCalenderChange(e,'fecha')} inputMode="date" inline={false} placeholder={formatDate(client.fecha)} />
                                {submitted && !client.fecha && <small className="p-invalid">la fecha es necesaria</small>}
                            </div>
                        </div>

                        <div className="field">
                            <label className="mb-3">Numeromovil</label>
                            <InputText id="numeromovil" value={client.numeromovil} onChange={(e) => onInputChange(e, 'numeromovil')} required className={classNames({ 'p-invalid': submitted && !client.numeromovil })} />
                        </div>
                        
                        <div className="field">
                            <label htmlFor="visitasdelpaciente">Visitas del Paciente</label>
                            <InputNumber id="visitasdelpaciente" value={client.visitasdelpaciente} onValueChange={(e) => onInputNumberChange(e, 'visitasdelpaciente')} required className={classNames({ 'p-invalid': submitted && !client.visitasdelpaciente })} />
                            {submitted && !client.visitasdelpaciente && <small className="p-invalid">Percent is required.</small>}
                        </div>

                       
                    </Dialog>

                    <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientDialogFooter} onHide={hideDeleteClientDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>¿Estás seguro de que quieres eliminar <b>{client.paciente}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientsDialogFooter} onHide={hideDeleteClientsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>¿Está seguro de que desea eliminar los clientes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

export default React.memo(Clients);