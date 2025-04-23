import '../styles/SeguimientoBeca.css';
import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { InfoItem } from '../components/InformacionItem';
import generatePDF from '../util/reportSeguimientoGenerator';
import { toast } from 'sonner';
import { uploadPDFAzure } from '../util/uploadPDFAzure';
import { sendEmailACS } from '../services/ReporteSeguimiento/sendEmailACS';
import { informacionSeguimientoBecaAPI, setStateBeca, saveReport } from '../services/ReporteSeguimiento/informacionSeguimientoBecaAPI';
import { MdSearch } from "react-icons/md";
import { ActividadesRealizadas } from '../services/ActividadesBecario/ActividadesRealizadas';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import Modal from '../components/Modal';

export const SeguimientoBeca = () => {
    const { getUser } = useAuth();
    const { refreshReport, refreshBecaEstado } = useDashboard();
    const date = new Date();
    const [activeTab, setActiveTab] = useState('generalInformation');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [startMonth, setStartMonth] = useState();
    const [finishMonth, setFinishMonth] = useState('');
    const [nombreBecarioCorto, setNombreBecarioCorto] = useState('');
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
    const [dataSeguimiento, setDataSeguimiento] = useState();
    const [, setActividadesRealizadas] = useState([]); //se guarda las actividades realizadas
    const [actividadesFiltradas, setActividadesFiltradas] = useState([]); //se guarda la actividad filtrada
    const [searchNoCuenta, setSearchNoCuenta] = useState('');
    const [selectedPeriodo, setSelectedPeriodo] = useState('I Periodo');
    const [anioPeriodo, setAnioPeriodo] = useState(date.getFullYear());
    const [oldStateBeca, setOldStateBeca] = useState('');
    const [newStateBeca, setNewStateBeca] = useState('');
    const [idNewStateBeca, setIdNewStateBeca] = useState('');
    const [observacionCambioEstado, setObservacionCambioEstado] = useState(''); //para guardar el motivo del cambio del estado de la beca
    const [observacion, setObservacion] = useState('Ninguna.'); //alguna observacion extra
    const [totalHoras, setTotalHoras] = useState(0);

    let user = getUser();
    const ModalConfirmacion = () => {
        const handleConfirmar = async () => {
            const estadoAnterior = dataSeguimiento.estado_beca; // Guarda el valor antes de cambiarlo
            setOldStateBeca(estadoAnterior);

            const result = await setStateBeca({ no_cuenta: dataSeguimiento.no_cuenta, estado_beca_id: idNewStateBeca });

            if (result.state) {
                setDataSeguimiento((prev) => ({ ...prev, estado_beca: newStateBeca }));
                refreshBecaEstado({ estado_beca_id: idNewStateBeca });
                setNewStateBeca('');
                setMostrarModalConfirmacion(false);
                toast.success("Estado actualizado con éxito.");
            } else {
                toast.error("Hubo un error al actualizar el estado.");
            }
        };

        return (
            <Modal
                isOpen={mostrarModalConfirmacion}
                type="save"
                title="¿Estás seguro de cambiar el estado de la beca?"
                onConfirm={handleConfirmar}
                onCancel={() => setMostrarModalConfirmacion(false)}
            >
                <p>El estado de la beca pasara a <strong>{newStateBeca}</strong>.</p>
            </Modal>
        );
    };

    const getData = async () => {
        if (searchNoCuenta) {
            try {
                setActiveTab('generalInformation');
                setActividadesRealizadas([]);
                const result = await informacionSeguimientoBecaAPI({ no_cuenta: searchNoCuenta });
                if (result.state) {
                    setDataSeguimiento(result.body);
                    let nombre = result.body.nombre.split(' ');
                    let apellido = result.body.apellido.split(' ');
                    setNombreBecarioCorto(`${nombre[0]} ${apellido[0]}`);

                    const fechaInicioBeca = new Date(result.body.fecha_inicio_beca).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                    setDataSeguimiento((prev) => ({ ...prev, fecha_inicio_beca: fechaInicioBeca }));

                    toast.success("Datos obtenidos con éxito");
                } else {
                    setDataSeguimiento('');
                    setActividadesFiltradas([]);
                    toast.warning(`ERROR: ${result.body}`);
                }
            } catch (error) {
                toast.info(`No se encontraron resultados. ${error}`);
            }
        } else {
            setDataSeguimiento('');
            setActividadesFiltradas([]);
            toast.warning("Ingrese un número de cuenta para buscar a un becario.");
        }
    };

    const handleSearch = async () => {
        try {
            const resultActivity = await ActividadesRealizadas({ no_cuenta: searchNoCuenta }, startMonth, finishMonth);

            if (resultActivity && Array.isArray(resultActivity.actividades) && resultActivity.actividades.length > 0) {
                setActividadesRealizadas(resultActivity.actividades);

                // Convertir startMonth y finishMonth a fechas de comparación
                const inicio = new Date(`${startMonth}-01`); // Primer día del mes
                const fin = new Date(`${finishMonth}-01`);
                fin.setMonth(fin.getMonth() + 1); // Moverse al siguiente mes y restar 1 día para obtener el último día del mes seleccionado
                fin.setDate(fin.getDate() - 1);

                const actividadesFiltradas = resultActivity.actividades.filter((actividad) => {
                    const fechaActividad = new Date(actividad.fecha_actividad);
                    return fechaActividad >= inicio && fechaActividad <= fin;
                });

                if (actividadesFiltradas.length > 0) {
                    const actividadesFormateadas = actividadesFiltradas.map((actividad) => {
                        const fechaActividad = new Date(actividad.fecha_actividad);
                        return {
                            ...actividad,
                            fecha_actividad: fechaActividad.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }),
                        };
                    });
                    setActividadesFiltradas(actividadesFormateadas);

                    // Calcular total de horas solo con las actividades filtradas
                    const total = actividadesFiltradas.reduce((acc, actividad) => acc + actividad.numero_horas, 0);
                    setTotalHoras(total);

                    toast.info("Se obtuvieron actividades dentro del rango seleccionado.");
                } else {
                    setActividadesRealizadas([]);
                    setTotalHoras(0);
                    toast.info("No se encontraron actividades en el periodo seleccionado.");
                }
            } else {
                setActividadesRealizadas([]);
                setTotalHoras(0);
                toast.info("No se encontraron actividades para el becario.");
            }
        } catch (error) {
            console.error("Error obteniendo actividades: ", error);
            setActividadesRealizadas([]);
            setTotalHoras(0);
            toast.error("Hubo un error al obtener la actividad.");
        }
    };

    //Determinar el periodo anterior
    useEffect(() => {
        const month = date.getMonth();
        switch (month) {
            case 0:
            case 1:
            case 2:
            case 3:
                setSelectedPeriodo('III Periodo');
                setAnioPeriodo(date.getFullYear() - 1)
                setStartMonth(`${date.getFullYear() - 1}-09`);
                setFinishMonth(`${date.getFullYear() - 1}-12`);
                break;
            case 4:
            case 5:
            case 6:
            case 7:
                setSelectedPeriodo('I Periodo');
                setAnioPeriodo(date.getFullYear());
                setStartMonth(`${date.getFullYear()}-01`);
                setFinishMonth(`${date.getFullYear()}-04`);
                break;
            case 8:
            case 9:
            case 10:
            case 11:
                setSelectedPeriodo('II Periodo');
                setAnioPeriodo(date.getFullYear());
                setStartMonth(`${date.getFullYear()}-04`);
                setFinishMonth(`${date.getFullYear()}-07`);
                break;
            default:
                break;
        }
    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const handleCreateAndSaveReport = async (dataSeguimiento, oldStateBeca, actividadesFiltradas, newStateBeca, observacionCambioEstado, observacion, selectedPeriodo, anioPeriodo) => {
        const fecha_reporte = new Date().toISOString().slice(0, 19).replace("T", " ");
        try {
            console.log("Generando Reporte...");
            //creamos el pdf
            const pdfBlob = generatePDF(dataSeguimiento, actividadesFiltradas, oldStateBeca, observacionCambioEstado, observacion, selectedPeriodo, anioPeriodo);
            //Guardamos el PDF en Azure Storage
            const pdfURL = await uploadPDFAzure(pdfBlob, searchNoCuenta, selectedPeriodo, anioPeriodo);
            console.log('pdfURL: ', pdfURL.split('?')[0]);
            //Guardar el reporte en la base de datos...
            const nuevoReporte = {
                no_cuenta: dataSeguimiento.no_cuenta,
                nombre_estado_anterior: oldStateBeca ? oldStateBeca : dataSeguimiento.estado_beca,
                empleado_id: user.empleado_id.trim(),
                nombre_reporte: `Reporte Seguimiento Academico ${selectedPeriodo} ${anioPeriodo}`,
                fecha_reporte: fecha_reporte,
                estado_nuevo_beca_id: idNewStateBeca ? idNewStateBeca : null,
                motivo_cambio_estado_beca: observacionCambioEstado,
                total_horas: totalHoras,
                observaciones: observacion,
                enlace: pdfURL.split('?')[0]
            };

            const resultSaveReport = await saveReport(nuevoReporte);

            if (resultSaveReport.state) {
                toast.success("Reporte guardado con éxito.");
                //Enviar el PDF usando Azure Comunication Services
                setIsSendingEmail(true);
                const name = nombreBecarioCorto ? nombreBecarioCorto : ''
                const resultSenEmail = await sendEmailACS({
                    // Cuando se implemente
                    // email: dataSeguimiento.correo_institucional, 
                    email: 'rodrigo.funes@unah.hn', //Para Desarrollo
                    pdfURL,
                    name,
                    periodo: selectedPeriodo,
                    anio: anioPeriodo
                })

                if (resultSenEmail) {
                    toast.success("Reporte generado, guardado y enviado con éxito!!!");
                    setIsSendingEmail(false);
                    refreshReport({ no_cuenta: dataSeguimiento.no_cuenta });

                    setActiveTab('generalInformation');
                    setObservacionCambioEstado('');
                    setObservacion('');
                    setOldStateBeca('');
                    setNewStateBeca('');
                    setIdNewStateBeca('');
                    setDataSeguimiento(null);
                    setActividadesRealizadas([]);
                    setActividadesFiltradas([]);
                    setSearchNoCuenta('');
                } else {
                    toast.error("Hubo un error al generar o enviar el reporte.");
                    setIsSendingEmail(false);
                }
            } else {
                toast.error(`${resultSaveReport.body.error}`);
            }

        } catch (error) {
            console.error("Error al generar el reporte o enviar el correo:", error);
            toast.error("Hubo un error al generar o enviar el reporte.");
        }
    };

    const handleNewStateBeca = (e) => {
        const estadoId = e.target.value;
        const estadoTexto = e.target.options[e.target.selectedIndex].text;
        setNewStateBeca(estadoTexto);
        setIdNewStateBeca(estadoId);
        setMostrarModalConfirmacion(true);
    }

    return (
        <div className="seguimiento-beca-container">
            <h1 className="seguimiento-beca-container-h1">Reportes de Seguimiento Académico</h1>
            <h2 className="seguimiento-beca-container-h2">Programa de Atención Socioeconómica y Estímulos Educativos (PASEE)</h2>
            <SearchBar searchTerm={searchNoCuenta} setSearchTerm={setSearchNoCuenta} onSearch={getData} />
            <div className='seguimiento-fecha'>
                <strong>Fecha: </strong>
                <p>{date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                                    src={`https://ui-avatars.com/api/?size=128&name=${nombreBecarioCorto ? `${nombreBecarioCorto}` : "Rodrigo Fúnes"}&background=003b74&color=FBFCF8&length=2&bold=true`}
                                    alt={nombreBecarioCorto ? nombreBecarioCorto : 'Nombre Becario'}
                                />
                            </div>
                            <div className='info-general-becario'>
                                <InfoItem label='Nombre Completo: ' value={dataSeguimiento ? `${dataSeguimiento.nombre} ${dataSeguimiento.apellido}` : ''} />
                                <InfoItem label='No. Cuenta: ' value={dataSeguimiento ? dataSeguimiento.no_cuenta : ''} />
                                <InfoItem label='Correo Institucional: ' value={dataSeguimiento ? dataSeguimiento.correo_institucional : ''} />
                                <InfoItem label='Carrera: ' value={dataSeguimiento ? dataSeguimiento.nombre_carrera : ''} />
                                <InfoItem label='Centro de Estudio: ' value={dataSeguimiento ? dataSeguimiento.nombre_centro_estudio : ''} />
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
                            <div className='periodo-academico-detalles'>
                                <InfoItem label='Periodo Academico: ' value={dataSeguimiento ? (
                                    dataSeguimiento.periodo_academico ? dataSeguimiento.periodo_academico === 1 ? 'I Periodo' : dataSeguimiento.periodo_academico === 2 ? 'II Periodo' : 'III Periodo' : ''
                                ) : (
                                    ''
                                )} />
                                <InfoItem label='Año: ' value={dataSeguimiento ? dataSeguimiento.anio_academico : ''} />
                            </div>
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
                                        <td>{dataSeguimiento.indice_global}</td>
                                        <td>{dataSeguimiento.indice_anual}</td>
                                        <td>{dataSeguimiento.indice_periodo}</td>
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
                                <InfoItem label='Tipo de beca: ' value={dataSeguimiento ? dataSeguimiento.nombre_beca : 'ND'} />
                                <InfoItem label='Fecha de inicio de la beca: ' value={dataSeguimiento ? dataSeguimiento.fecha_inicio_beca : 'ND'} />
                                <InfoItem label='Estado Actual' value={dataSeguimiento ? dataSeguimiento.estado_beca : 'ND'} />
                                <div className='beca-estado-nuevo'>
                                    <label htmlFor="beca-estado-nuevo">
                                        <strong>Nuevo Estado</strong>
                                    </label>
                                    <select name="newState" id='beca-estado-nuevo'
                                        value={idNewStateBeca}
                                        onChange={handleNewStateBeca}>
                                        <option value="" disabled>--Selecciona un estado--</option>
                                        <option value='0'>Activa</option>
                                        <option value='1'>Suspendida</option>
                                        <option value='2'>Finalizada</option>
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
                    <div className='search-activities-periodo'>
                        <label htmlFor="startMonth"><strong>Inicio:</strong></label>
                        <input
                            className='search-actividades-periodo-input'
                            type='month'
                            id='startMonth'
                            name='startMonth'
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                        />
                        <label htmlFor="finishMonth"><strong>Fin:</strong></label>
                        <input
                            className='search-actividades-periodo-input'
                            type='month'
                            id='finishMonth'
                            name='finishMonth'
                            value={finishMonth}
                            onChange={(e) => setFinishMonth(e.target.value)}
                        />
                        <button
                            className='search-actividades-periodo-button'
                            onClick={handleSearch}>Buscar <MdSearch /></button>
                    </div>
                    {actividadesFiltradas.length > 0 ? (
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
                                    {actividadesFiltradas.map((actividad, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{actividad.nombre_actividad}</td>
                                            <td>{actividad.fecha_actividad}</td>
                                            <td>{actividad.numero_horas}</td>
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
                        <p>Escoja un rango de fechas y de click en buscar para mostrar las actividades realizadas.</p>
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
                                className={`boton-guardar mt-3 ${isSendingEmail ? '' : ''}`}
                                onClick={() => handleCreateAndSaveReport(dataSeguimiento, oldStateBeca, actividadesFiltradas, newStateBeca, observacionCambioEstado, observacion, selectedPeriodo, anioPeriodo)}
                            >
                                {isSendingEmail ? (
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
            {mostrarModalConfirmacion && <ModalConfirmacion />}
        </div>
    );
}

export default SeguimientoBeca;