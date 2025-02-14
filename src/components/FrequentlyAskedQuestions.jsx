
import { useState, useEffect } from 'react';
import { Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import { fetchData } from '../services/faqAPI';

import '../styles/FrequentlyAskedQuestions.css';

const FAQComponent = () => {
    const [data, setData] = useState([]);
    console.log('data: ', data);
    const [originalData, setOriginalData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getData = async () => {
        try {
            const result = await fetchData();
            console.log("Resultado de fetchData:", result);

            const parsedData = Array.isArray(result.dataFetch) ? result.dataFetch : [];
            console.log('parsedData: ', parsedData);

            setData(parsedData);
            setOriginalData(parsedData);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar"
                    aria-label="Buscar"
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Buscar
                </Button>
            </InputGroup>
            <Accordion defaultActiveKey="0">
                {data.length > 0 ? (
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
                    <p>No se encontraron resultados</p>
                )}
            </Accordion>
        </div>
    );
};

export default FAQComponent;