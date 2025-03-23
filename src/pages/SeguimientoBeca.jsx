import '../styles/SeguimientoBeca.css';
import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { InfoItem } from '../components/InformacionItem';
import generatePDF from '../util/reportSeguimientoGenerator';
import { toast } from 'sonner';
import { uploadPDFAzure } from '../util/uploadPDFAzure';
import { sendEmail } from '../services/sendEmail';
import { sendEmailACS } from '../services/sendEmailACS';

function nameBecario(nombres, apellidos) {
    let nombre = nombres.split(' ');
    let apellido = apellidos.split(' ');
    return `${nombre[0]} ${apellido[0]}`;
}

export const SeguimientoBeca = () => {
    const [activeTab, setActiveTab] = useState('generalInformation');
    const date = new Date();
    const [loading, setLoading] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [error, setError] = useState(null);

    //Aqui se guardaria toda la informacion recibida en caso de ser un solo JSON
    const [dataSeguimiento, setDataSeguimiento] = useState({
        informacionGeneral: {
            nombre: 'Rodrigo Eliezer',
            apellido: 'Fúnes Enríquez',
            no_cuenta: '20171001103',
            correo_institucional: 'rodrigo.funes@unah.hn',
            nombre_carrera: 'Ingenieria en Sistemas',
            centro_estudio: 'CU'
        },
        desempenoAcademico: {
            indiceGlobal: 70.4560,
            indiceAnual: 75.4512,
            indicePerido: 80.4512
        },
        estadoBeca: {
            inicioBeca: '27/01/2024',
            tipoBeca: 'Beca Tipo A',
            estadoActual: 'Activa'
        },
        actividadesRealizadas: [
            {
                nombre_actividad: "Actividad 1",
                fecha_actividad: "2025-01-01",
                horas: 10
            },
            {
                nombre_actividad: "Actividad 2",
                fecha_actividad: "2025-01-02",
                horas: 10
            },
            {
                nombre_actividad: "Actividad 3",
                fecha_actividad: "2025-01-03",
                horas: 10
            },
            {
                nombre_actividad: "Actividad 4",
                fecha_actividad: "2025-01-04",
                horas: 40
            },
            {
                nombre_actividad: "Actividad 5",
                fecha_actividad: "2025-01-05",
                horas: 50
            }
        ],

    });

    const [searchNoCuenta, setSearchNoCuenta] = useState('');
    const [selectedPeriodo, setSelectedPeriodo] = useState('I Periodo');
    const [anioPeriodo, setAnioPeriodo] = useState(date.getFullYear());
    const [newStateBeca, setNewStateBeca] = useState('');
    const [observacionCambioEstado, setObservacionCambioEstado] = useState('');
    const [observacion, setObservacion] = useState('Ninguna.');
    const [totalHoras, setTotalHoras] = useState(0);

    //Obtener toda la información para el seguimiento según numero cuenta
    const getData = async () => {
        setLoading(true);
        try {
            //const result = await fetchReport({ no_cuenta: noCuenta });
            //setDataSeguimiento(result);

            toast.success("Datos obtenidos con éxito");
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setError(error.message || 'Error al obtener los datos.');
            toast.info('No se encontraron resultados.')
        } finally {
            setLoading(false);
        }
    };

    //Determinar el periodo anterior
    useEffect(() => {
        const month = date.getMonth();
        switch (month) {
            case 1:
            case 2:
            case 3:
            case 4:
                setSelectedPeriodo('III Periodo');
                setAnioPeriodo(date.getFullYear() - 1)
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                setSelectedPeriodo('I Periodo');
                setAnioPeriodo(date.getFullYear());
                break;
            case 9:
            case 10:
            case 11:
            case 12:
                setSelectedPeriodo('II Periodo');
                setAnioPeriodo(date.getFullYear());
                break;
            default:
                break;
        }
    }, []);

    //calculo del total de horas realizadas, cambiar de ser necesario
    useEffect(() => {
        if (dataSeguimiento) {
            const total = dataSeguimiento.actividadesRealizadas.reduce((sum, actividad) => sum + actividad.horas, 0);
            setTotalHoras(total);
        }

    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const handleCreateAndSaveReport = async (dataSeguimiento, newStateBeca, observacionCambioEstado, observacion) => {
        try {
            console.log("Generando Reporte...");
            console.log("Datos del seguimiento:", dataSeguimiento);
            console.log("Nuevo Estado de Beca:", newStateBeca);
            console.log("Motivo del Cambio:", observacionCambioEstado);
            console.log("Observaciones Generales:", observacion);

            //creamos el pdf
            const pdfBlob = generatePDF(dataSeguimiento, newStateBeca, observacionCambioEstado, observacion, selectedPeriodo, anioPeriodo);
            //Guardamos el PDF en Azure Storage
            const pdfURL = await uploadPDFAzure(pdfBlob, searchNoCuenta, selectedPeriodo);
            console.log('pdfURL: ', pdfURL)

            //Enviar el PDF
            setSendEmail(true);
            const name = dataSeguimiento ? nameBecario(dataSeguimiento.informacionGeneral.nombre, dataSeguimiento.informacionGeneral.apellido) : ''
            await sendEmailACS({
                email: 'rodrigo.funes@unah.hn',
                pdfURL,
                name,
                periodo: selectedPeriodo,
                anio: anioPeriodo
            })

            // Mostrar mensaje de éxito con toast
            toast.success("Reporte generado y enviado con éxito");
            setSendEmail(false);

            //Guardar el reporte en la base de datos...


        } catch (error) {
            console.error("Error al generar el reporte o enviar el correo:", error);
            toast.error("Hubo un error al generar o enviar el reporte.");
        }
    };

    return (
        <div className="seguimiento-beca-container">
            <h1>Reportes de Seguimiento Académico</h1>
            <h2>Programa de Atención Socioeconómica y Estímulos Educativos (PASEE)</h2>
            {/* Habria que modificar la funcion en onSearch que busca la informacion necesaria segun nuemro de cuenta*/}
            <SearchBar searchTerm={searchNoCuenta} setSearchTerm={setSearchNoCuenta} onSearch={getData} />
            <div className='seguimiento-fecha'>
                <strong>Fecha: </strong>
                <p>{date.toLocaleString()}</p>
            </div>
            <div className='periodo-seguimiento'>
                <label htmlFor="periodo-select"><strong>Periodo Académico: </strong></label>
                <select name="periodo" id="periodo-select"
                    value={selectedPeriodo}
                    onChange={e => setSelectedPeriodo(e.target.value)}>
                    <option value="I Periodo">I Periodo</option>
                    <option value="II Periodo">II Periodo</option>
                    <option value="III Periodo">III Periodo</option>
                </select>
                <label htmlFor="anio-select"><strong>Año: </strong></label>
                <select name="anio" id="anio-select"
                    value={anioPeriodo}
                    onChange={e => setAnioPeriodo(e.target.value)}>
                    <option value={date.getFullYear() - 1}>{date.getFullYear() - 1}</option>
                    <option value={date.getFullYear()}>{date.getFullYear()}</option>
                    <option value={date.getFullYear() + 1}>{date.getFullYear() + 1}</option>
                </select>
            </div>
            <ul className="mt-3 tab-title">
                <li className={`tab ${activeTab === 'generalInformation' ? 'active' : ''}`}>
                    <a href="#generalInformation" onClick={() => handleTabClick('generalInformation')}>Información General</a>
                </li>
                <li className={`tab ${activeTab === 'academicPerformance' ? 'active' : ''}`}>
                    <a href="#academicPerformance" onClick={() => handleTabClick('academicPerformance')}>Desempeño Academico</a>
                </li>
                <li className={`tab ${activeTab === 'becaStatus' ? 'active' : ''}`}>
                    <a href="#becaStatus" onClick={() => handleTabClick('becaStatus')}>Estado de la Beca</a>
                </li>
                <li className={`tab ${activeTab === 'activities' ? 'active' : ''}`}>
                    <a href="#activities" onClick={() => handleTabClick('activities')}>Actividades Realizadas</a>
                </li>
                <li className={`tab ${activeTab === 'observations' ? 'active' : ''}`}>
                    <a href="#observations" onClick={() => handleTabClick('observations')}>Observaciones</a>
                </li>
            </ul>
            <div className="tab-panels">
                <div id="generalInformation" className="panel" hidden={activeTab !== 'generalInformation'}>
                    {dataSeguimiento ? (
                        <div className='general-information'>
                            <div className="profile-becario">
                                <img
                                    className="profile-becario-photo"
                                    src={`https://ui-avatars.com/api/?size=128&name=${dataSeguimiento ? `${nameBecario(dataSeguimiento.informacionGeneral.nombre, dataSeguimiento.informacionGeneral.apellido)}` : "Rodrigo Fúnes"}&background=003b74&color=FBFCF8&length=2&bold=true`}
                                    alt={dataSeguimiento ? nameBecario(dataSeguimiento.informacionGeneral.nombre, dataSeguimiento.informacionGeneral.apellido) : 'Nombre Becario'}
                                />
                            </div>
                            <div className='info-general-becario'>
                                <InfoItem label='Nombre Completo: ' value={dataSeguimiento ? `${dataSeguimiento.informacionGeneral.nombre} ${dataSeguimiento.informacionGeneral.apellido}` : ''} />
                                <InfoItem label='No. Cuenta: ' value={dataSeguimiento ? dataSeguimiento.informacionGeneral.no_cuenta : ''} />
                                <InfoItem label='Correo Institucional: ' value={dataSeguimiento ? dataSeguimiento.informacionGeneral.correo_institucional : ''} />
                                <InfoItem label='Carrera: ' value={dataSeguimiento ? dataSeguimiento.informacionGeneral.nombre_carrera : ''} />
                                <InfoItem label='Centro de Estudio: ' value={dataSeguimiento ? dataSeguimiento.informacionGeneral.centro_estudio : ''} />
                            </div>
                        </div>
                    ) : (
                        <p>Ingrese un No. cuenta para mostrar la información.</p>
                    )}

                </div>
                <div id="academicPerformance" className="panel" hidden={activeTab !== 'academicPerformance'}>
                    {dataSeguimiento ? (
                        <>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe itaque laboriosam sequi excepturi inventore, atque, impedit nesciunt rerum placeat omnis enim maxime soluta aperiam! Nemo vitae minus fugiat deleniti sequi?</p>
                            <table className='desempeno-academico'>
                                <thead>
                                    <tr>
                                        <th>Índice Global</th>
                                        <th>Índice Anual</th>
                                        <th>Índice del Periodo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{dataSeguimiento.desempenoAcademico.indiceGlobal}</td>
                                        <td>{dataSeguimiento.desempenoAcademico.indiceAnual}</td>
                                        <td>{dataSeguimiento.desempenoAcademico.indicePerido}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>Ingrese un No. cuenta para mostrar la información.</p>
                    )}
                </div>
                <div id="becaStatus" className="panel" hidden={activeTab !== 'becaStatus'}>
                    {dataSeguimiento ? (
                        <>
                            <p>Información relevante acerca de la beca que posee el estudiante becado por la UNAH a traves de PASEE.</p>
                            <div className='beca-estado'>
                                <InfoItem label='Tipo de beca: ' value={dataSeguimiento ? dataSeguimiento.estadoBeca.tipoBeca : 'ND'} />
                                <InfoItem label='Fecha de inicio de la beca: ' value={dataSeguimiento ? dataSeguimiento.estadoBeca.inicioBeca : 'ND'} />
                                <InfoItem label='Estado Actual' value={dataSeguimiento ? dataSeguimiento.estadoBeca.estadoActual : 'ND'} />
                                <div className='beca-estado-nuevo'>
                                    <label htmlFor="beca-estado-nuevo">
                                        <strong>Nuevo Estado</strong>
                                    </label>
                                    <select name="newState" id='beca-estado-nuevo'
                                        value={newStateBeca}
                                        onChange={e => setNewStateBeca(e.target.value)}>
                                        <option value="">--Selecciona un estado--</option>
                                        <option value="Activa">Activa</option>
                                        <option value="Suspendida">Suspendida</option>
                                        <option value="Finalizada">Finalizada</option>
                                    </select>
                                </div>
                            </div>
                            <div className='beca-estado-cambio'>
                                <strong>Motivo del cambio:</strong>
                                <textarea
                                    value={observacionCambioEstado}
                                    onChange={e => setObservacionCambioEstado(e.target.value)}></textarea>
                            </div>
                        </>
                    ) : (
                        <p>Ingrese un No. cuenta para mostrar la información.</p>
                    )}
                </div>
                <div id="activities" className="panel" hidden={activeTab !== 'activities'}>
                    {dataSeguimiento ? (
                        <>
                            <p>Actividades realizadas por el becario durante el periodo academico para el cumplimiento de sus horas becas.</p>
                            <table className='actividades-realizadas-seguimiento'>
                                <thead>
                                    <tr>
                                        <th >No.</th>
                                        <th>Nombre Actividad</th>
                                        <th>Fecha Actividad</th>
                                        <th>Horas Beca</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataSeguimiento.actividadesRealizadas.map((actividad, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{actividad.nombre_actividad}</td>
                                            <td>{actividad.fecha_actividad}</td>
                                            <td>{actividad.horas}</td>
                                        </tr>

                                    ))}
                                    <tr>
                                        <td style={{ borderTop: '1px solid var(--primary-bg-color)' }} colSpan={3}>Total Horas</td>
                                        <td style={{ borderTop: '1px solid var(--primary-bg-color)' }}>{totalHoras}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>Ingrese un No. cuenta para mostrar la información.</p>
                    )}
                </div>
                <div id="observations" className="panel" hidden={activeTab !== 'observations'}>
                    {dataSeguimiento ? (
                        <>
                            <p>Espacio para agregar otras observaciones relacionadas con el seguimiento de la beca realizado.</p>
                            <textarea
                                value={observacion}
                                onChange={e => setObservacion(e.target.value)}></textarea>

                            <button
                                className={`boton-guardar mt-3 ${sendEmail ? '' : ''}`}
                                onClick={() => handleCreateAndSaveReport(dataSeguimiento, newStateBeca, observacionCambioEstado, observacion)}
                            >
                                {sendEmail ? (
                                    <span className="dotsSending">
                                        Enviando <span className="dotSending">.</span><span className="dotSending">.</span><span className="dotSending">.</span>
                                    </span>
                                ) : (
                                    "Generar Reporte"
                                )}
                            </button>


                        </>
                    ) : (
                        <p>Ingrese un No. cuenta para mostrar la información.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SeguimientoBeca;