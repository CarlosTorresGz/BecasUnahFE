import { useState, useEffect } from 'react';
import { Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/FrequentlyAskedQuestions.css';

const fetchData = async () => {
    try {
        const response = await fetch("https://d7eq6mz1gj.execute-api.us-east-1.amazonaws.com/dev/question");
        const data = await response.json();
        console.log("Datos recibidos:", data); // Depuración
        return data;
    } catch (err) {
        console.error('Fetch error', err);
        return { body: "[]" }; // Devuelve un JSON válido para evitar errores
    }
};

const FAQComponent = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]); // <-- Agregado

    const getData = async () => {
        try {
            const result = await fetchData();
            const parsedData = JSON.parse(result.body); // Convertir el string JSON a array
            setData(parsedData);
            setOriginalData(parsedData); // <-- Se usa correctamente
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSearch = () => {
        const searchTerm = document.querySelector('input[aria-label="Buscar"]').value.toLowerCase();
        
        if (searchTerm === '') {
            setData(originalData); // <-- Ahora funciona correctamente
        } else {
            setData(originalData.filter(item =>
                item.pregunta.toLowerCase().includes(searchTerm) ||
                item.respuesta.toLowerCase().includes(searchTerm)
            ));
        }
    };

    return (
        <div className='faq-section'>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar"
                    aria-label="Buscar"
                    aria-describedby="basic-addon2"
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Buscar
                </Button>
            </InputGroup>
            <Accordion defaultActiveKey="0">
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>
                                {item.pregunta}
                            </Accordion.Header>
                            <Accordion.Body>
                                {item.respuesta}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                ) : (
                    <p>No hay preguntas frecuentes disponibles.</p>
                )}
            </Accordion>
        </div>
    );
};

export default FAQComponent;
