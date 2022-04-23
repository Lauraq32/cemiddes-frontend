import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import  ProductService from '../service/ProductService';
import { AppMenu } from '../AppMenu';
import axios from 'axios';
import headers from '../service/token';

const Products = () => {
    let emptyProduct = {
        _id: null,
        productos: '',
        role: 'Not Admin',
        cantidad: 0,
        precio: 0
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    // const headers =  {
    //     Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MjU1YmFmMDI2ZTljZGRkYmU0ZTczNTciLCJpYXQiOjE2NDk4MjEzMTYsImV4cCI6MTY0OTkwNzcxNn0.8SJHpMe8SuUV_G3I_m_jHx6QBza2E2fqshiLIW-id-o",

    // }
    
    useEffect(() => {
        getAllProducts();
    }, []);
    
    const getAllProducts = () => {
        axios.get("http://localhost:8080/api/productos/todos", {headers})
        .then((response) => {
            const allProducts = response.data.productos;
            setProducts(allProducts);
            //console.log(allProducts);
        })
        .catch(error => console.error('Error: ${error}'));
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.productos.trim()) {
            let _products = [...products];
            let _product = { ...product };

            //console.log("prod id is:", product._id);
            if (product._id) {
                axios.put('http://localhost:8080/api/productos/actualizar/' + _product._id, _product , {headers}, )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    getAllProducts();

                })
                .catch(error => console.error('Error in editProduct:',error));
            }
            else {   
                axios.post("http://localhost:8080/api/productos/almacen", _product, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    getAllProducts();
                })
                .catch(error => console.error('Error while posting product',error));
            }

            
            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    }

    const editProduct = (product) => {
        setProduct({ ...product });
        //console.log({...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val._id !== product._id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);

        axios.delete('http://localhost:8080/api/productos/borrar/' + product._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in delete Product:',error));
        
    }

    const findIndexById = (_id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i]._id === _id) {
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
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Productos</span>
                {rowData.productos}
            </>
        );
    }

    const quantityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {rowData.cantidad}
            </>
        );
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.precio)}
            </>
        );
    }

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
       
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} productos"
                        globalFilter={globalFilter} emptyMessage="No se encontraron productos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="productos" header="Productos" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="cantidad" header="Cantidad" body={quantityBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="precio" header="Precio" body={priceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="productos">Productos</label>
                            <InputText id="productos" value={product.productos} onChange={(e) => onInputChange(e, 'productos')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.productos })} />
                            {submitted && !product.productos && <small className="p-invalid">el nombre de la doctora es necesario.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cantidad">Cantidad</label>
                                <InputNumber id="cantidad" value={product.cantidad} onValueChange={(e) => onInputNumberChange(e, 'cantidad')} integeronly />
                                {submitted && !product.cantidad && <small className="p-invalid">el Cantidad es necesario.</small>}

                            </div>

                            <div className="field col">
                                <label htmlFor="precio">Precio</label>
                                <InputNumber id="precio" value={product.precio} onValueChange={(e) => onInputNumberChange(e, 'precio')} mode="currency" currency="USD" locale="en-US" />
                                {submitted && !product.precio && <small className="p-invalid">el precio es necesario.</small>}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Estás seguro de que quieres eliminar <b>{product.productos}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Está seguro de que desea eliminar los productos seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Products);
