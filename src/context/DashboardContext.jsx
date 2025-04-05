import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import fetchAllData from '../services/ActividadesAdministrador/ActividadesAdminAPI';
import PropTypes from 'prop-types';
import fetchParcialData from '../services/ActividadesBecario/ActividadesBecarioAPI';
import ActividadesInscritasData from '../services/ActividadesBecario/ActividadesInscritasBecario';
import ActividadesRealizadas from '../services/ActividadesBecario/ActividadesRealizadas';
import { fetchReport } from '../services/reportAPI';
import { fetchStateBecaById } from '../services/PerfilBecario/becaAPI';
import { fetchPlanillas } from '../services/Planilla/planillaAPI';
import fetchData from '../services/FAQ/faqAPI';

export const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard debe usarse dentro de un DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children, userType }) => {
    DashboardProvider.propTypes = {
        children: PropTypes.node.isRequired,
        userType: PropTypes.string.isRequired,
    };

    const { getUser, loadingUser } = useAuth();

    let user = getUser();
    const [dataFetchBecarios, setDataFetchBecarios] = useState({
        actividades: null,
        inscritas: null,
        realizadas: null,
        reportes: null,
        becaEstado: null,
        planilla: null
    });
    const [dataFetch, setDataFetch] = useState({
        actividades: null,
        faq: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && !loadingUser) {
            const loadData = async () => {
                try {
                    setLoading(true);
                    if (userType === 'admin') {
                        const data = await fetchAllData();
                        const faq = await fetchData();
                        setDataFetch({
                            actividades: data ? { data: data.actividades, error: null } : { data: null, error: 'No hay actividades' },
                            faq: faq ? { data: faq.preguntas, error: null } : { data: null, error: 'No hay preguntas frecuentes' }
                        });
                    } else if (userType === 'becario') {
                        const data = await fetchParcialData({ centro_id: user.centro_estudio_id });
                        const dataActInscritas = await ActividadesInscritasData({ no_cuenta: user.no_cuenta });
                        const dataActRealizadas = await ActividadesRealizadas({ no_cuenta: user.no_cuenta });
                        const dataReport = await fetchReport({ no_cuenta: user.no_cuenta });
                        const dataEstadoBeca = await fetchStateBecaById({ estado_beca_id: user.estado_beca_id });
                        const dataPlanilla = await fetchPlanillas({ becario_id: user.becario_id });
                        setDataFetchBecarios({
                            actividades: data ? { data: data.actividades, error: null } : { data: null, error: 'No hay actividades' },
                            inscritas: dataActInscritas ? { data: dataActInscritas.actividades, error: null } : { data: null, error: 'No hay actividades inscritas' },
                            realizadas: dataActRealizadas ? { data: dataActRealizadas.actividades, error: null } : { data: null, error: 'No hay actividades realizadas' },
                            reportes: dataReport.state ? { data: dataReport.body, error: null } : { data: null, error: 'No se encontró reportes con el no_cuenta proporcionado.' },
                            becaEstado: dataEstadoBeca.body || null,
                            planilla: dataPlanilla.body || null
                        });
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error cargando datos:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }
    }, [userType, user, loadingUser]);

    const refreshData = async () => {
        setLoading(true);
        try {
            const dataFetch = await fetchAllData();
            setDataFetch(
                prev => ({
                    ...prev,
                    actividades: dataFetch ? { data: dataFetch.actividades, error: null } : { data: null, error: 'No hay actividades' }
                })
            )
            const data = await fetchParcialData({ centro_id: user.centro_estudio_id ? user.centro_estudio_id : user.centro_id });
            setDataFetchBecarios(
                prev => ({
                    ...prev,
                    actividades: data ? { data: data.actividades, error: null } : { data: null, error: 'No hay actividades' }
                })
            )
        } catch (error) {
            console.error('Error al obtener actividades:', error);
        } finally {
            setLoading(false);
        }
    }

    const refreshActInscritas = async () => {
        const dataActInscritas = await ActividadesInscritasData({ no_cuenta: user.no_cuenta });
        setDataFetchBecarios(
            prev => ({
                ...prev,
                inscritas: dataActInscritas ? { data: dataActInscritas.actividades, error: null } : { data: null, error: 'No hay actividades inscritas' }
            })
        )
    }

    const refreshActRealizadas = async () => {
        const dataActRealizadas = await ActividadesRealizadas({ no_cuenta: user.no_cuenta });
        setDataFetchBecarios(
            prev => ({
                ...prev,
                realizadas: dataActRealizadas ? { data: dataActRealizadas.actividades, error: null } : { data: null, error: 'No hay actividades realizadas' }
            })
        )
    }

    const refreshReport = async ({ no_cuenta }) => {
        const dataReport = await fetchReport({ no_cuenta });
        setDataFetchBecarios(
            prev => ({
                ...prev,
                reportes: dataReport.state ? { data: dataReport.body, error: null } : { data: null, error: 'No se encontró reportes con el no_cuenta proporcionado.' }
            })
        )
    }

    const refreshBecaEstado = async ({ estado_beca_id }) => {
        const dataEstadoBeca = await fetchStateBecaById({ estado_beca_id });
        setDataFetchBecarios(
            prev => ({
                ...prev,
                becaEstado: dataEstadoBeca.body
            })
        )
    }

    const refreshPlanilla = async () => {
        const dataPlanilla = await fetchPlanillas({ becario_id: user.becario_id });
        setDataFetchBecarios(
            prev => ({
                ...prev,
                planilla: dataPlanilla.body
            })
        )
    }

    const refreshFAQ = async () => {
        const faq = await fetchData();
        setDataFetch(
            prev => ({
                ...prev,
                faq: faq ? { data: faq.preguntas, error: null } : { data: null, error: 'No hay preguntas frecuentes' }
            })
        )
    }

    // Valores que estará disponible para todos los componentes hijos
    const value = {
        userType,
        dataFetch,
        dataFetchBecarios,
        loading,
        error,
        refreshData,
        refreshActInscritas,
        refreshActRealizadas,
        refreshReport,
        refreshBecaEstado,
        refreshPlanilla,
        refreshFAQ
    };

    return (
        <DashboardContext.Provider value={value}>
            {!loadingUser && children}
        </DashboardContext.Provider>
    );
};

