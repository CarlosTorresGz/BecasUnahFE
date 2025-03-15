
import { useState, useEffect } from 'react';
import { Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import fetchData from '../services/faqAPI';

import '../styles/FrequentlyAskedQuestions.css';

const FAQComponent = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getData = async () => {
        try {
            const result = await fetchData();
            const preguntas = result.preguntas;
    
            if (Array.isArray(preguntas)) {
                setData(preguntas);
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

    return (
        <div className='faq-section'>
            <h1>Preguntas Frecuentes</h1>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar"
                    aria-label="Buscar"
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" id="button-addon2">
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

export default FAQComponent;