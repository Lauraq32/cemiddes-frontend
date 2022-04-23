import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import axios from 'axios';
import headers from '../service/token';

const Reservations = () => {
    let emptyReservation = {
        _id: null,
        paciente: '',
        tratamiento: '',
        numeromovil: '',
        montoapagar: null,
        tipodepago:'',
        doctora:'',
        doctoraId:'',
        porciento: null,
        ganancia: null
    };

    const [patients, setPatients] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [dropdownValue, setDropdownValue] = useState([]);

    const [patientDialog, setPatientDialog] = useState(false);
    const [deletePatientDialog, setDeletePatientDialog] = useState(false);
    const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
    const [patient, setPatient] = useState(emptyReservation);
    const [selectedPatients, setSelectedPatients] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        // const patientService = new ReservationService();
        // patientService.getPatients().then(data => setPatients(data));
        getAllReservations();
        getDoctors();
    }, []);

    const getAllReservations = () => {
        axios.get("http://localhost:8080/api/reservation/todos", {headers})
        .then((response) => {
            const allReservations = response.data.reservations;
            setPatients(allReservations);
            console.log("response: ", allReservations);
        })
        .catch(error => console.error('Error in getting all reservations:',error));
    }

    const getDoctors = () => {
        axios.get("http://localhost:8080/api/doctoras/information", {headers})
        .then((response) => {
            const allDoctors = response.data.doctoras;
            setDoctors(allDoctors);
        })
        .catch(error => console.error('Error in getting all reservations:',error));
    }

    

    //const doctorsLegth = doctors.length;
   // var dropdownValues = {};
    

    const dropdownValues = doctors === null
    ? "Loading..." : doctors.map(doctors => ({
        doctora: doctors.doctora,
        id: doctors._id
    }));

    // const dropdownValues = [
    //     { name: 'New York', code: 'NY' },
    //     { name: 'Rome', code: 'RM' },
    //     { name: 'London', code: 'LDN' },
    //     { name: 'Istanbul', code: 'IST' },
    //     { name: 'Paris', code: 'PRS' }
    // ];

    console.log("doctors are:", dropdownValues);

    // const createSelectItems = ()=> {         
    //     for (let i = 0; i <= Object.keys(doctors).length; i++) {             
    //         dropdownValue['name'] = doctors[i].doctora;
    //         dropdownValue['id'] = doctors[i]._id;

    //          //here I will be creating my options dynamically based on
    //          //what props are currently passed to the parent component
    //     }
    //     return dropdownValues;
    // }  
    // console.log("selected items:",createSelectItems());


    // const searchDoctors = (event) => {
    //     setTimeout(() => {
    //         if (!event.query.trim().length) {
    //             setAutoFilteredValue([...autoValue]);
    //         }
    //         else {
    //             setAutoFilteredValue(autoValue.filter((doctora) => {
    //                 return doctora.name.toLowerCase().startsWith(event.query.toLowerCase());
    //             }));
    //         }
    //     }, 250);
    // };

    const formatCurrency = (value) => {
        return value.toLocaleString('es-PA', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setPatient(emptyReservation);
        setSubmitted(false);
        setPatientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPatientDialog(false);
    }

    const hideDeletePatientDialog = () => {
        setDeletePatientDialog(false);
    }

    const hideDeletePatientsDialog = () => {
        setDeletePatientsDialog(false);
    }

    const savePatient = () => {
        setSubmitted(true);

        if (patient.paciente.trim()) {
            let _patients = [...patients];
            let _patient = { ...patient };
            let doctoraId = dropdownValue.id;
            _patient.doctora = dropdownValue.doctora;
            _patient.doctoraId = dropdownValue.id;

            console.log("doctor id is:" , _patient.doctoraId);
            if (patient._id) {
                axios.put('http://localhost:8080/api/reservation/update/' + _patient._id, _patient, {headers} )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Updated', life: 3000 });
                    getAllReservations();
                })
                .catch(error => console.error('Error in editing reservation:',error));
            
            }
            else {
                axios.post("http://localhost:8080/api/reservation/paciente", _patient, doctoraId, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Added', life: 3000 });
                    getAllReservations();
                })
                .catch(error => console.error('Error while posting reservation',error));
            
            }

            setPatients(_patients);
            setPatientDialog(false);
            setPatient(emptyReservation);
        }
    }

    const editPatient = (patient) => {
        setPatient({ ...patient });
        setPatientDialog(true);
    }

    const confirmDeletePatient = (patient) => {
        setPatient(patient);
        setDeletePatientDialog(true);
    }

    const deletePatient = () => {
        let _patients = patients.filter(val => val._id !== patient._id);
        setPatients(_patients);
        setDeletePatientDialog(false);
        setPatient(emptyReservation);
        axios.delete('http://localhost:8080/api/reservation/delete/' + patient._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in delete reservation:',error));
        
    }

    const findIndexById = (_id) => {
        let index = -1;
        for (let i = 0; i < patients.length; i++) {
            if (patients[i]._id === _id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let _id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            _id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return _id;
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeletePatientsDialog(true);
    }

    const deleteSelectedPatients = () => {
        let _patients = patients.filter(val => !selectedPatients.includes(val));
        setPatients(_patients);
        setDeletePatientsDialog(false);
        setSelectedPatients(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted', life: 3000 });
    }

    const onPaymentTypeChange = (e) => {
        let _patient = { ...patient };
        _patient['tipodepago'] = e.value;
        setPatient(_patient);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _patient = { ...patient };
        _patient[`${name}`] = val;

        setPatient(_patient);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _patient = { ...patient };
        _patient[`${name}`] = val;

        setPatient(_patient);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPatients || !selectedPatients.length} />
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
                <span className="p-column-title">Paciente</span>
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

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Numeromovil</span>
                {rowData.numeromovil}
            </>
        );
    }
    
    const amountPayableBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Montoapagar</span>
                {formatCurrency(rowData.montoapagar)}
            </>
        );
    }

    const paymentTypeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo de pago</span>
                {rowData.tipodepago}
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

    const percentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Porciento</span>
                {rowData.porciento}{"%"}
            </>
        );
    }

    const gananciaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ganancia</span>
                {Math.round(rowData.ganancia)}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPatient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePatient(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestionar reservas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const patientDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePatient} />
        </>
    );
    const deletePatientDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePatient} />
        </>
    );
    const deletePatientsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPatients} />
        </>
    );

    return (
        <div className="grid patients-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={patients} selection={selectedPatients} onSelectionChange={(e) => setSelectedPatients(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} patientes"
                        globalFilter={globalFilter} emptyMessage="No se encontraron productos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="paciente" header="Paciente" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="tratamiento" header="Tratamiento" sortable body={treatmentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="numeromovil" header="Telefono" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="montoapagar" header="Montoapagar" body={amountPayableBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="tipodepago" header="Tipo de pago" sortable body={paymentTypeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="doctora" header="Doctora" sortable body={doctorBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="porciento" header="Porciento" sortable body={percentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        {/* <Column field="ganancia" header="Ganancia" body={gananciaBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column> */}
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={patientDialog} style={{ width: '450px' }} header="Patient Details" modal className="p-fluid" footer={patientDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="paciente">Paciente</label>
                            <InputText id="paciente" value={patient.paciente} onChange={(e) => onInputChange(e, 'paciente')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.paciente })} />
                            {submitted && !patient.paciente && <small className="p-invalid">el nombre del paciente es necesario.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="tratamiento">Paciente Tratamiento</label>
                            <InputText id="tratamiento" value={patient.tratamiento} onChange={(e) => onInputChange(e, 'tratamiento')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.tratamiento })} />
                            {submitted && !patient.tratamiento && <small className="p-invalid">se necesita agregar el tratamiento.</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Telefono</label>
                            <InputText id="numeromovil" value={patient.numeromovil} onChange={(e) => onInputChange(e, 'numeromovil')} className={classNames({ 'p-invalid': submitted && !patient.numeromovil })} />
                            {/* {submitted && !patient.numeromovil && <small className="p-invalid">el numeromovil es necesario.</small>} */}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="montoapagar">Montoapagar</label>
                                <InputNumber id="montoapagar" value={patient.montoapagar} onValueChange={(e) => onInputNumberChange(e, 'montoapagar')} mode="currency" currency="USD" locale="en-US" />
                                {submitted && !patient.montoapagar && <small className="p-invalid">el total del tratamiento es necesario.</small>}
                            </div>
                        </div>

                        <div className="field">
                            <label className="mb-3">Tipo de pago</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType1" name="tipodepago" value="Tarjeta" onChange={onPaymentTypeChange} checked={patient.tipodepago === 'Tarjeta'} />
                                    <label htmlFor="paymentType1">Tarjeta</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType2" name="tipodepago" value="Efectivo" onChange={onPaymentTypeChange} checked={patient.tipodepago === 'Efectivo'} />
                                    <label htmlFor="paymentType2">Efectivo</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType2" name="tipodepago" value="Transferencia" onChange={onPaymentTypeChange} checked={patient.tipodepago === 'Transferencia'} />
                                    <label htmlFor="paymentType2">Transferencia</label>
                                </div>
                                {submitted && !patient.tipodepago && <small className="p-invalid">la forma de pago en necesaria.</small>}

                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="doctora">Doctora</label>
                            {/* <select name="doctora" value={doctors.doctora}>
                                {this.doctors.map((e, key) => {
                                    return <option key={key} value={e.value}>{e.name}</option>;
                                })}
                            </select> */}
                            <Dropdown id="doctora" value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="doctora" placeholder="Select" />
                            {/* <AutoComplete placeholder="" id="doctora" dropdown multiple value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="doctora" /> */}
                            {/* <InputText id="doctora" value={patient.doctora} onChange={(e) => onInputChange(e, 'doctora')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.doctora })} /> */}
                            {/* {submitted && !patient.doctora && <small className="p-invalid">el nombre de la doctora es necesario.</small>} */}
                        </div>
                        
                        <div className="field">
                            <label htmlFor="porciento">Porciento</label>
                            <InputNumber id="porciento" value={patient.porciento} onValueChange={(e) => onInputNumberChange(e, 'porciento')} className={classNames({ 'p-invalid': submitted && !patient.porciento })} />
                            {/* {submitted && !patient.porciento && <small className="p-invalid">Porciento is required.</small>} */}
                        </div>
                       
                    </Dialog>

                    <Dialog visible={deletePatientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePatientDialogFooter} onHide={hideDeletePatientDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {patient && <span>¿Estás seguro de que quieres eliminar <b>{patient.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePatientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePatientsDialogFooter} onHide={hideDeletePatientsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {patient && <span>¿Está seguro de que desea eliminar los pacientes seleccionados?</span>}
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

export default React.memo(Reservations);