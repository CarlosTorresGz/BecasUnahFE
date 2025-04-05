import '../styles/Report.css';
import { useState, useEffect } from 'react';
import { fetchReport, fetchBecarioInfoReport } from '../services/reportAPI';
import TableReport from '../components/TableReport';
import { toast } from 'sonner';
import { dashboardPropTypes } from "../util/propTypes";
import SpinnerLoading from '../components/SpinnerLoading';
import { useDashboard } from '../context/DashboardContext';
import SearchBar from '../components/SearchBar';

export const Report = () => {
    const { userType, dataFetchBecarios, loading } = useDashboard();
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState(null);
    const [noCuenta, setNoCuenta] = useState('');
    const [data, setData] = useState([]);
    const [dataBecario, setDataBecario] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (userType === 'becario') {
            if(!loading) {
                setData(dataFetchBecarios.reportes.data);
            }    
        }

        const getData = async () => {
            setLoadingReport(true);
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
                    if (searchTerm) toast.info('No se encontraron resultados.')
                }

            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setError(error.message || 'Error al obtener los datos.');
                toast.error('No se encontraron resultados.')
            } finally {
                setLoadingReport(false);
            }
        };

        if (searchTerm || noCuenta) getData();

    }, [dataFetchBecarios, noCuenta, userType]);

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
            {loadingReport ? (
                <SpinnerLoading />
            ) : userType === 'becario' ? (
                <TableReport data={data} />
            ) : (
                <div>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Ingrese el número de cuenta del becario" onSearch={handleSearch} />
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

Report.propTypes = dashboardPropTypes;