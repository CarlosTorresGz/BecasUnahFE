
import { useState, useEffect } from 'react';
import { Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/FrequentlyAskedQuestions.css';

const fetchData = async () => {
    try {
        const response = await fetch('https://d7eq6mz1gj.execute-api.us-east-1.amazonaws.com/dev/question');
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }
};

const FAQComponent = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const getData = async () => {
        try {
            const result = await fetchData();
            setData(result);
            setOriginalData(result);
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
            setData(originalData);
        } else {
            const filteredData = originalData.filter(item =>
                item.pregunta.toLowerCase().includes(searchTerm) ||
                item.respuesta.toLowerCase().includes(searchTerm)
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
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Buscar
                </Button>
            </InputGroup>
            <Accordion defaultActiveKey="0">
                {data.map((item, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>
                            {item.pregunta}
                        </Accordion.Header>
                        <Accordion.Body>
                            {item.respuesta}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQComponent;