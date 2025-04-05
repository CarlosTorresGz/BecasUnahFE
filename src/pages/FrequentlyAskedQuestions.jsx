import { useState, useEffect } from 'react';
import { Accordion, Form, Button, Modal } from 'react-bootstrap';
import fetchData from '../services/FAQ/faqAPI';
import updatePregunta from '../services/FAQ/UpdatePreguntasFrecuentas';
import crearPreguntas from '../services/FAQ/CrearPreguntas'; // Asegúrate de que la ruta sea correcta
import '../styles/FrequentlyAskedQuestions.css';
import { toast } from 'sonner';
import SearchBar from '../components/SearchBar';
import { MdSearch } from "react-icons/md";
import { useAuth } from '../context/AuthContext';

const FAQComponent = () => {
    const { getUser } = useAuth();
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [addingNew, setAddingNew] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedPreguntaId, setSelectedPreguntaId] = useState(null);

    const isAdmin = getUser() ? getUser().rol : false;

    const getData = async () => {
        try {
            const result = await fetchData();
            const preguntas = result.preguntas;

            if (Array.isArray(preguntas)) {
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

    const handleEdit = (index, pregunta, respuesta, preguntaId) => {
        setEditingIndex(index);
        setEditedQuestion(pregunta);
        setEditedAnswer(respuesta);
        setSelectedPreguntaId(preguntaId); // Guardar el pregunta_id seleccionado
    };

    const handleOpenConfirmModal = (index) => {
        setSelectedIndex(index);
        setShowConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedIndex(null);
    };

    const handleSaveConfirmed = async () => {
        if (selectedIndex === null || selectedPreguntaId === null) return;

        const preguntaId = selectedPreguntaId; // Usamos el pregunta_id almacenado

        if (isNaN(preguntaId)) {
            console.error("Error: pregunta_id no es un número válido.");
            return;
        }

        const success = await updatePregunta(preguntaId, editedQuestion, editedAnswer);
        if (success.success) {
            const updatedData = [...data];
            updatedData[selectedIndex] = { pregunta: editedQuestion, respuesta: editedAnswer, pregunta_id: preguntaId }; // Asegura que el ID se mantenga
            setData(updatedData);
            setOriginalData(updatedData);
            setEditingIndex(null);
            toast.success(`${success.message}`);
        } else {
            toast.error(success.errorMessage);
        }

        handleCloseConfirmModal();
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setAddingNew(false);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const handleAddNewQuestion = async () => {
        const success = await crearPreguntas(newQuestion, newAnswer);
        if (success.success) {
            // Si la creación fue exitosa, actualizamos la lista de preguntas
            setData([...data, { pregunta: newQuestion, respuesta: newAnswer }]);
            setOriginalData([...originalData, { pregunta: newQuestion, respuesta: newAnswer }]);
            setNewQuestion("");
            setNewAnswer("");
            toast.success('Pregunta agregada con exito');

            setAddingNew(false);
        } else {
            console.error('Error al agregar pregunta: ', success.errorMessage);
            toast.error(success.errorMessage);
        }
    };

    return (
        <div className='faq-section'>
            {!isAdmin ? <h1>Preguntas Frecuentes</h1> : ''}
            <SearchBar text={<MdSearch />} placeholder='Buscar' searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {/* Botón para agregar pregunta */}
            {isAdmin && !addingNew && (
                <div className="mb-2 mt-3">
                    <Button variant="primary" className="mb-3" onClick={() => setAddingNew(true)}>
                        Agregar Pregunta
                    </Button>
                </div>
            )}
            {/* Formulario para agregar una nueva pregunta */}
            {addingNew && (
                <div className="mt-3">
                    <Form.Control
                        placeholder="Nueva Pregunta"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <Form.Control
                        style={{ minHeight: '150px' }}
                        as="textarea"
                        placeholder="Nueva Respuesta"
                        className="mt-2 min"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                    />
                    <div className="mt-2 mb-2">
                        <Button variant="success" onClick={handleAddNewQuestion}>Guardar Nueva Pregunta</Button>
                        <Button variant="danger" className="ms-2" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            {data.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {data.map((item, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>{item.pregunta}</Accordion.Header>
                            <Accordion.Body>
                                {editingIndex === index ? (
                                    <div>
                                        <Form.Control
                                            value={editedQuestion}
                                            onChange={(e) => setEditedQuestion(e.target.value)}
                                        />
                                        <Form.Control
                                            style={{ minHeight: '150px' }}
                                            value={editedAnswer}
                                            onChange={(e) => setEditedAnswer(e.target.value)}
                                            as="textarea"
                                            className="mt-2"
                                        />
                                        <div className="mt-2">
                                            <Button variant="success" onClick={() => handleOpenConfirmModal(index)}>
                                                Guardar
                                            </Button>
                                            <Button variant="danger" className="ms-2" onClick={handleCancel}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{item.respuesta}</p>
                                        {isAdmin && (
                                            <Button variant="warning" onClick={() => handleEdit(index, item.pregunta, item.respuesta, item.pregunta_id)}>
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <p className="no-results">No se encontraron resultados</p>
            )}

            {/* Modal de Confirmación */}
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar actualización</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas guardar los cambios en la pregunta?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseConfirmModal}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSaveConfirmed}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FAQComponent;
