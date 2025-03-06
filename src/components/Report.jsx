import '../styles/Report.css';
import { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { fetchReport, fetchBecarioInfoReport } from '../services/reportAPI';
import TableReport from './TableReport';
import { toast } from 'sonner';

export const Report = ({ userType }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [noCuenta, setNoCuenta] = useState('');
    const [data, setData] = useState([]);
    const [dataBecario, setDataBecario] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem('user'));

        if (!userLocal) {
            console.error('No se encontró user en localStorage');
            setError('No se encontró la información del usuario.');
            //setLoading(false);
            return;
        }

        if (userType === 'becario') {
            setNoCuenta(userLocal.no_cuenta || '');
        }

    }, [userType]);

    useEffect(() => {
        //if (!noCuenta) return;

        const getData = async () => {
            setLoading(true);
            try {
                const result = await fetchReport({ no_cuenta: noCuenta });
                if (result.state) {
                    setData(result.body)

                    if (userType === 'admin') {
                        const becarioResult = await fetchBecarioInfoReport({ no_cuenta: noCuenta });
                        if (becarioResult.state) {
                            setDataBecario(becarioResult.body[0])
                        } else {
                            setDataBecario({
                                nombre_completo: '',
                                no_cuenta: '',
                                correo_institucional: '',
                                nombre_carrera: '',
                                nombre_centro_estudio: ''
                            });
                            setError('No existe un becario con ese numero de cuenta.');
                        }
                    }
                } else {
                    setData([])
                    setDataBecario({
                        nombre_completo: '',
                        no_cuenta: '',
                        correo_institucional: '',
                        nombre_carrera: '',
                        nombre_centro_estudio: ''
                    });
                    setSearchTerm('')
                    if(searchTerm) toast.info('No se encontraron resultados.')
                }

            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setError(error.message || 'Error al obtener los datos.');
                toast.error('No se encontraron resultados.')
            } finally {
                setLoading(false);
            }
        };

        if(searchTerm || noCuenta) getData();

    }, [noCuenta, userType]);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast.warning('Por favor, ingrese un número de cuenta.');
            return;
        }
        setNoCuenta(searchTerm.trim());
    };

    if (error) {
        return <div>Error al cargar los datos: {error}. Por favor, intenta de nuevo más tarde.</div>;
    }

    return (
        <div className="report">
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner animation="border" role="status" style={{ color: "#20527E" }}>
                        <span className="visually-hidden" style={{ color: "#20527E" }}>Loading...</span>
                    </Spinner>
                </div>
            ) : userType === 'becario' ? (
                <TableReport data={data} />
            ) : (
                <div>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Ingrese el número de cuenta del becario"
                            aria-label="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                            Buscar
                        </Button>
                    </InputGroup>
                    {dataBecario && (
                        <div style={{ margin: '25px 0' }}>
                            <h1 className='informacion-general'>Información General</h1>
                            <div className='info-general'>
                                <div className='info-general-etiqueta'>
                                    <span>Nombre Completo:</span>
                                    <input
                                        type="text"
                                        value={dataBecario ? dataBecario.nombre_completo : ''}
                                        readOnly
                                    />
                                </div>
                                <div className='info-general-etiqueta'>
                                    <span>No. Cuenta:</span>
                                    <input
                                        type="text"
                                        value={dataBecario ? dataBecario.no_cuenta : ''}
                                        readOnly
                                    />
                                </div>
                                <div className='info-general-etiqueta'>
                                    <span>Correo Institucional:</span>
                                    <input
                                        type="text"
                                        value={dataBecario ? dataBecario.correo_institucional : ''}
                                        readOnly
                                    />
                                </div>

                                <div className='info-general-etiqueta'>
                                    <span>Carrera:</span>
                                    <input
                                        type="text"
                                        value={dataBecario ? dataBecario.nombre_carrera : ''}
                                        readOnly />
                                </div>
                                <div className='info-general-etiqueta'>
                                    <span>Centro de Estudio:</span>
                                    <input
                                        type="text"
                                        value={dataBecario ? dataBecario.nombre_centro_estudio : ''}
                                        readOnly />
                                </div>
                            </div>
                        </div>
                    )}
                    <TableReport data={data} />
                </div>
            )}
        </div >
    );
};