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
import { DoctorService } from '../service/DoctorService';
import headers from '../service/token';
import axios from 'axios';




const Doctors = () => {
    let emptyDoctor = {
        _id: null,
        doctora: '',
        numeromovil:'',
        totaldeganancias: ''
    };

    const [doctors, setDoctors] = useState(null);
    const [doctorDialog, setDoctorDialog] = useState(false);
    const [deleteDoctorDialog, setDeleteDoctorDialog] = useState(false);
    const [deleteDoctorsDialog, setDeleteDoctorsDialog] = useState(false);
    const [doctor, setDoctor] = useState(emptyDoctor);
    const [selectedDoctors, setSelectedDoctors] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        // const doctorService = new DoctorService();
        // doctorService.getDoctors().then(data => setDoctors(data));
        getAllDoctors();
    }, []);

    const getAllDoctors = () => {
        axios.get("http://localhost:8080/api/doctoras/information", {headers})
        .then((response) => {
            const allDoctors = response.data.doctoras;
            setDoctors(allDoctors);
            console.log("doctors received are:", allDoctors);
        })
        .catch(error => console.error('Error:', error));
    }


    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setDoctor(emptyDoctor);
        setSubmitted(false);
        setDoctorDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDoctorDialog(false);
    }

    const hideDeleteDoctorDialog = () => {
        setDeleteDoctorDialog(false);
    }

    const hideDeleteDoctorsDialog = () => {
        setDeleteDoctorsDialog(false);
    }

    const saveDoctor = () => {
        setSubmitted(true);

        if (doctor.doctora.trim()) {
            let _doctors = [...doctors];
            let _doctor = { ...doctor };
            if (doctor._id) {
                axios.put('http://localhost:8080/api/doctoras//update/' + doctor._id, _doctor ,{headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Updated', life: 3000 });
                    getAllDoctors();                  
                })
                .catch(error => console.error('Error in editDoctor:',error));
            }
            else {
                axios.post("http://localhost:8080/api/doctoras/doctora", _doctor, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Added', life: 3000 });
                    getAllDoctors();
                })
                .catch(error => console.error('Error while posting Doctor : ${error}'));
                setDoctors(_doctors);
            }

            setDoctorDialog(false);
            setDoctor(emptyDoctor);
        

            
        }
    }

    const editDoctor = (doctor) => {
        
        setDoctor({ ...doctor });
        setDoctorDialog(true);
        
    }

    const confirmDeleteDoctor = (doctor) => {
        setDoctor(doctor);
        setDeleteDoctorDialog(true);
    }

    const deleteDoctor = () => {
        let _doctors = doctors.filter(val => val._id !== doctor._id);
        setDoctors(_doctors);
        setDeleteDoctorDialog(false);
        setDoctor(emptyDoctor);
        axios.delete('http://localhost:8080/api/doctoras/delete/' + doctor._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in deleteDoctor():',error));
    }

    const findIndexById = (_id) => {
        let index = -1;
        for (let i = 0; i < doctors.length; i++) {
            if (doctors[i]._id === _id) {
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
        setDeleteDoctorsDialog(true);
    }

    const deleteSelectedDoctors = () => {
        let _doctors = doctors.filter(val => !selectedDoctors.includes(val));
        setDoctors(_doctors);
        setDeleteDoctorsDialog(false);
        setSelectedDoctors(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _doctor = { ...doctor };
        _doctor[`${name}`] = val;

        setDoctor(_doctor);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _doctor = { ...doctor };
        _doctor[`${name}`] = val;

        setDoctor(_doctor);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDoctors || !selectedDoctors.length} />
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
                <span className="p-column-title">Doctora</span>
                {rowData.doctora}
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

    const totalEarningsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Total de ganancias</span>
                {formatCurrency(rowData.totaldeganancias)}
                {/* {rowData.totaldeganancias} */}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDoctor(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteDoctor(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar médicos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const doctorDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDoctor} />
        </>
    );
    const deleteDoctorDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDoctor} />
        </>
    );
    const deleteDoctorsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDoctors} />
        </>
    );

    return (
        
        <div className="grid doctors-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={doctors} selection={selectedDoctors} onSelectionChange={(e) => setSelectedDoctors(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} doctoras"
                        globalFilter={globalFilter} emptyMessage="No se encontraron doctoras." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="doctora" header="Doctora" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="numeromovil" header="Teléfono" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        {/* <Column field="porciento" header="Porciento" sortable body={percentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column> */}
                        <Column field="totaldeganancias" header="Total de ganancias" body={totalEarningsBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={doctorDialog} style={{ width: '450px' }} header="Doctor Details" modal className="p-fluid" footer={doctorDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="doctora">Doctora</label>
                            <InputText id="doctora" value={doctor.doctora} onChange={(e) => onInputChange(e, 'doctora')} autoFocus className={classNames({ 'p-invalid': submitted && !doctor.doctora })} />
                            {submitted && !doctor.doctora && <small className="p-invalid">el nombre de la doctora es necesario</small>}

                        </div>

                        <div className="field">
                            <label className="mb-3">Numeromovil</label>
                            <InputText id="numeromovil" value={doctor.numeromovil} onChange={(e) => onInputChange(e, 'numeromovil')} required className={classNames({ 'p-invalid': submitted && !doctor.numeromovil })} />
                            {submitted && !doctor.numeromovil && <small className="p-invalid">el numeromovil es necesario</small>}
                        </div>

                        {/* <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="ganancias">Total de ganancias</label>
                                <InputNumber id="ganancias" value={doctor.ganancias} onValueChange={(e) => onInputNumberChange(e, 'ganancias')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div> */}
                    </Dialog>

                    <Dialog visible={deleteDoctorDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDoctorDialogFooter} onHide={hideDeleteDoctorDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && <span>¿Estás seguro de que quieres eliminar <b>{doctor.doctora}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDoctorsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDoctorsDialogFooter} onHide={hideDeleteDoctorsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && <span>¿Está seguro de que desea eliminar los médicos seleccionados?</span>}
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

export default React.memo(Doctors);