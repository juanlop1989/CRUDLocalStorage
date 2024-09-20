import React, { useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { alertaSuccess, alertaError, alertaWarning } from '../funciones';

const ShowProveedores = () => {
    const [proveedores, setProveedores] = useState([])
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [titleModal, setTitleModal] = useState('')
    const [operation, setOperation] = useState(1)

    /**
     * Obtiene listado de proveedores desde el local storage
     */
    const getProveedor = () => {
        const localStorageProveedor = localStorage.getItem('PROVEEDOR')
        const parseProveedor = localStorageProveedor ? JSON.parse(localStorageProveedor) : []

        if (!Array.isArray(parseProveedor)) {
            setProveedores([])
        } else {
            setProveedores(parseProveedor)
        }
    }

    /**
     * Carga los registros de proveedores
     */
    useEffect(() => {
        getProveedor();
    }, [])


    /**
     * Abre el modal con los atributos de los proveedores, si se va a editar, se cargan los datos
     * @param {Number} operation - 1. Agregar, 2. Editar 
     * @param {Number} id - Identificador del rpoveedor
     * @param {String} name - Nombre del proveedor
     * @param {String} direccion - Dirección del proveedor
     * @param {string} yelefono - Teléfono del proveeedor
     */
    const openModal = (operation, id, name, direccion, telefono) => {
        setId('');
        setName('');
        setDireccion('');
        setTelefono('');

        if (operation === 1) {
            setTitleModal('Registrar Proveedor');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Proveedor');
            setOperation(2);
            setId(id);
            setName(name);
            setDireccion(direccion);
            setTelefono(telefono);
        }
    };

    /**
     * Permite el uso de localStorage dependiendo el tipo de operación
     * @param {string} metodo - Tipo de método a utilizar: POST, PUT, DELETE
     * @param {JSON} parametros - Objeto JSON que se enviará a localStorage
     */
    const enviarSolicitud = (metodo, parametros = {}) => {
        const saveUpdateProveedores = [...proveedores]
        let mensaje

        if (metodo === 'POST') {
            saveUpdateProveedores.push({ ...parametros, id: Date.now() })
            mensaje = 'Se guardó el proveedor'
        } else if (metodo === 'PUT') {
            const proveedoresIndex = saveUpdateProveedores.findIndex(proveedores => proveedores.id === parametros.id)

            if (proveedoresIndex !== -1) {
                saveUpdateProveedores[proveedoresIndex] = { ...parametros }
                mensaje = 'Se editó el proveedor'
            }
        } else if (metodo === 'DELETE') {
            const proveedores = saveUpdateProveedores.filter(proveedores => proveedores.id !== parametros.id)
            setProveedores(proveedores)
            localStorage.setItem('PROVEEDOR', JSON.stringify(proveedores))
            alertaSuccess('Se eliminó el proveedor')
            return
        }

        localStorage.setItem('PROVEEDOR', JSON.stringify(saveUpdateProveedores))
        setProveedores(saveUpdateProveedores)
        alertaSuccess(mensaje)
        document.getElementById('btnCerrarModal').click()

    }

     /**
     * Valida que cada uno de los campos del formulario no vayan vacíos
     */
     const validar = () => {
        let payload;
        let metodo;

        if (name === '') {
            alertaWarning('Nombre del proveedor en blanco', 'nombre');
        } else if (direccion === '') {
            alertaWarning('Dirección del proveedor en blanco', 'direccion');
        } else if (telefono === '') {
            alertaWarning('Teléfono del proveedor en blanco', 'telefono');
        } else {
            payload = {
                id: id || Date.now(),
                name: name,
                direccion: direccion,
                telefono: telefono
            };

            if (operation === 1) {
                metodo = 'POST';
            } else {
                metodo = 'PUT';
            }

            enviarSolicitud(metodo, payload);
        }
    };

    /**
     * Proceso para eliminar un proveedor
     * @param {Number} id - Identificador del proveedor a eliminar 
     */
    const deleteProveedor = (id) => {
        const MySwal = withReactContent(Swal);

        MySwal.fire({
            title: '¿Está seguro de eliminar el proveedor?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud('DELETE', { id });
            }
        }).catch((error) => {
            alertaError(error);
        });
    };



    // Función para verificar si hay registros en localStorage
    const hasProveedores = () => {
        const localStorageProveedor = localStorage.getItem('PROVEEDOR');
        return localStorageProveedor && JSON.parse(localStorageProveedor).length > 0;
    };

    /**
     * Proceso para eliminar todos los proveedores
     * @param {Number} id - Identificador del proveedor a eliminar 
     */
    const deleteAllProveedor = (id) => {
        const MySwal = withReactContent(Swal);

        MySwal.fire({
            title: '¿Está seguro de eliminar todos los Proveedores?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('PROVEEDOR');
                setProveedores([]);
                alertaSuccess('Se eliminaron todos los proveedores');
            }
        }).catch((error) => {
            alertaError(error);
        });
    };

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalProveedores">
                                <i className="fa-solid fa-circle-plus" /> Nuevo Proveedor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12 col-lg-8 offset-lg-2">
                    <div className="table-responsive">
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                                
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    proveedores.map((proveedores, i) => (
                                        <tr key={proveedores.id}>
                                            <td>{i + 1}</td>
                                            <td>{proveedores.name}</td>
                                            <td>{proveedores.direccion}</td>
                                            <td>{proveedores.telefono}</td>
                                            <td>
                                                <button onClick={() => openModal(2, proveedores.id, proveedores.name, proveedores.direccion, proveedores.telefono)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProveedores'>
                                                    <i className='fa-solid fa-edit' />
                                                </button>
                                                <button onClick={() => deleteProveedor(proveedores.id)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }

                                
                            </tbody>
                        </table>
                    </div>
                </div>
                                <div className="container-fluid">
                                    <div className="row mt-3">
                                        <div className="col-md-4 offset-md-4">
                                            <div className="d-grid mx-auto">
                                                {hasProveedores() && (
                                                    <button onClick={deleteAllProveedor} className="btn btn-danger mt-2">
                                                        <i className="fa-solid fa-trash-can" /> Elimina Todo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                
            </div>

            <div id='modalProveedores' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{titleModal}</label>
                            <button className='btn-close' data-bs-dismiss='modal' aria-label='close' />
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i class="fa-solid fa-signature"></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i class="fa-solid fa-signs-post"></i></span>
                                <input type='text' id='direccion' className='form-control' placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i class="fa-solid fa-phone"></i></span>
                                <input type='text' id='telefono' className='form-control' placeholder='telefono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk' /> Guardar
                            </button>
                            <button id='btnCerrarModal' className='btn btn-danger' data-bs-dismiss='modal'> Cerrar</button>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowProveedores;