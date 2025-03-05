///import '../styles/Report.css';
import { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { fetchReport } from '../services/reportAPI';
import TableReport from './TableReport';

export const Report = ({ userType }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noCuenta, setNoCuenta] = useState('');
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem('user'));

        if (!userLocal) {
            console.error('No se encontró user en localStorage');
            setError('No se encontró la información del usuario.');
            setLoading(false);
            return;
        }

        if (userType === 'becario') {
            setNoCuenta(userLocal.no_cuenta);
        } else {
            setNoCuenta('');
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
                } else {
                    setData([])
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setError(error.message || 'Error al obtener los datos.');
            } finally {
                setLoading(false);
            }
        };

        getData();

    }, [noCuenta]);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            setNoCuenta(searchTerm.trim());
        }
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
                    <div>

                    </div>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Buscar"
                            aria-label="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                            Buscar
                        </Button>
                    </InputGroup>
                    <TableReport data={data} />
                </div>
            )}
        </div >
    );
};