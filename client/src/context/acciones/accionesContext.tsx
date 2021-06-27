import { createContext } from 'react';
import { AccionType, ActividadRecienteType, FormItems } from '../../components/@types';
import { HistorialTotalItem } from '../../components/@types';

const AccionesContext = createContext({
    acciones: {} as any as AccionType,
    historial: {} as any as HistorialTotalItem,
    actividades_recientes: [] as any as ActividadRecienteType[],
    total_cuenta: 0,
    resultado_hoy: {} as any,
    resultado_total: {} as any,
    total_depositado: 0,
    total_comisiones: 0,
    loadingActualizarPrecios: false,
    agregarAccion: (form: FormItems) => { },
    cambiarMoneda: (moneda: 'dolares' | 'pesos') => { },
    actualizarPrecios: () => { },
    eliminarAccionHistorialItem: (ticker: any, position: any) => { },
    editarAccionHistorialItem: (data: any, ticker: any, position: any) => { }
});

export default AccionesContext