import { useState, useEffect } from 'react';
import { Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import fetchData from '../services/faqAPI'; // Asegúrate de usar el servicio correcto para obtener las becas

import '../styles/TipoBecas.css';

const TipoBecas = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getData = async () => {
        try {
            const result = await fetchData();
            const preguntas = result.preguntas;

            if (Array.isArray(preguntas)) {
                console.log("Preguntas recibidas:", preguntas);
                setData(preguntas);
                setOriginalData(preguntas);
            } else {
                console.error("Error: La API no devolvió preguntas en el formato esperado.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setData(originalData);
        } else {
            const filteredData = originalData.filter(item =>
                item.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.respuesta.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filteredData);
        }
    };

    return (
        <div className='faq-section'>
            <h1>Modalidades de Becas que se te ofrecen:</h1>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar"
                    aria-label="Buscar"
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" id="button-addon2" disabled>
                    Buscar
                </Button>
            </InputGroup>

            {data.filter(item =>
                item.pregunta.toLowerCase().includes(searchTerm.trim().toLowerCase())
            ).length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {data
                        .filter(item =>
                            item.pregunta.toLowerCase().includes(searchTerm.trim().toLowerCase())
                        )
                        .map((item, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>{item.pregunta}</Accordion.Header>
                                <Accordion.Body>{item.respuesta}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                </Accordion>
            ) : (
                <p className="no-results">No se encontraron resultados</p>
            )}
        </div>
    );
};

export default TipoBecas;
