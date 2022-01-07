import { useReducer, FC, useEffect } from 'react';
import {
    AccionesStateType,
    AccionType,
    FormItems,
    HistorialAccionItem,
    ActividadRecienteType
} from '../../components/@types';
import {
    obtenerFecha,
    nuevoHistorial,
    calcularPorcentaje,
    sortHistorial,
    calcularPorcentajeDiferencia
} from '../../utils';
import {
    AGREGAR_ACCION,
    ACTUALIZAR_TOTALES,
    ACTUALIZAR_ACTIVIDADES_RECIENTES,
    CAMBIAR_MONEDA,
    HYDRATE_STATE,
    ACTUALIZAR_PRECIOS,
    LOADING_ACTUALIZAR_PRECIOS,
    UNLOADING_ACTUALIZAR_PRECIOS,
    ACTUALIZAR_ACCIONES,
    ACTUALIZAR_ACCION,
    NEW_DAY,
    BORRAR_ACCION
} from '../type';
import AccionesContext from './accionesContext'
import AccionesReducer from './accionesReducer'
import axios from 'axios'

const AccionesState: FC = (props) => {

    const initialState: AccionesStateType = {
        acciones: {},
        historial: {},
        actividades_recientes: [],
        total_cuenta: 0,
        resultado_hoy: {
            porcentaje: 0,
            precio: 0
        },
        resultado_total: {
            porcentaje: 0,
            precio: 0
        },
        total_depositado: 0,
        total_comisiones: 0,
        loadingActualizarPrecios: false
    }

    const [state, dispatch]: [e: AccionesStateType, d: React.Dispatch<any>] = useReducer(AccionesReducer, initialState)

    useEffect(() => {

        const getData = async () => {
            let savedState;
            const localStorageState = localStorage.getItem('state');

            const getBackupData = async () => {
                try {
                    const res = await axios.get('http://localhost:3001/backup')
                    return res.data.data
                } catch (e) {
                    console.log(e)
                }
            }

            if (localStorageState) {
                savedState = JSON.parse(localStorageState)
            } else {
            }
            savedState = await getBackupData()

            if (savedState) {
                // actualizar totales de hoy
                const nuevosHistoriales = nuevoHistorial(savedState.total_cuenta, savedState.historial);
                const historialAyer = sortHistorial(Object.values(nuevosHistoriales))[1]
                const nuevoResultadoHoy = {
                    precio: historialAyer ? savedState.total_cuenta - historialAyer.total : 0,
                    porcentaje: historialAyer ?
                        calcularPorcentajeDiferencia(savedState.total_cuenta, historialAyer.total) : 0
                }

                dispatch({
                    type: HYDRATE_STATE,
                    payload: savedState
                })

                dispatch({
                    type: NEW_DAY,
                    payload: {
                        historial: nuevosHistoriales,
                        resultado_hoy: nuevoResultadoHoy
                    }
                })
            }
        }

        getData()

    }, [])

    useEffect(() => {
        const saveState = async () => {
            try {
                localStorage.setItem('state', JSON.stringify(state))
                await axios.post('http://localhost:3001/save', state)
            } catch (e) {
                console.log(e)
            }
        }

        if (state.total_cuenta !== 0) {
            saveState();
        }
    }, [state])

    const agregarAccion = (data: FormItems) => {
        const fecha = obtenerFecha(data.date)

        let accion: AccionType = {
            ticker: data.ticker,
            empresa: data.empresa,
            cantidad: 0,
            historial: [],
            total: 0,
            total_costo: 0,
            precio_unidad: 0,
            ultima_entrada: fecha,
            c_unidad_promedio: 0,
            diferencia_porcentaje_total: 0,
            diferencia_porcentaje_dia: 0,
            diferencia_precio_total: 0,
            diferencia_precio_dia: 0
        }

        if (data.ticker && state.acciones[data.ticker]) {
            const previousData = state.acciones[data.ticker] as AccionType
            accion.cantidad = previousData.cantidad
            accion.historial = previousData.historial
            accion.total = previousData.total
            accion.total_costo = previousData.total_costo
            accion.diferencia_porcentaje_dia = previousData.diferencia_porcentaje_dia
            accion.diferencia_precio_dia = previousData.diferencia_precio_dia
            accion.precio_unidad = previousData.precio_unidad
        }

        const totalCompra = +data.cantidad * +data.costo_u
        const nuevoTotal = +accion.total + +totalCompra
        const historialItem: HistorialAccionItem = {
            fecha: {
                copy: fecha,
                time: new Date(fecha).getTime()
            },
            cantidad: +data.cantidad,
            costo_unitario: +data.costo_u,
            costo_total: +totalCompra,
            comision: +data.comision,
            total_accion: nuevoTotal
        }

        accion.historial = sortHistorial([...accion.historial, historialItem])

        const nuevaAccion = actualizarAccion(accion, historialItem)

        if (nuevaAccion.cantidad === 0) {
            const nuevasAcciones = { ...state.acciones };
            delete nuevasAcciones[nuevaAccion.ticker]
            dispatch({
                type: BORRAR_ACCION,
                payload: nuevasAcciones
            })
        } else {
            dispatch({
                type: AGREGAR_ACCION,
                payload: nuevaAccion
            })
        }

        actualizarTotales(historialItem)
        actualizarActividadesRecientes(accion, totalCompra, +data.cantidad)
    }

    const actualizarTotales = (historialAccion: HistorialAccionItem) => {
        const totalCuenta = state.total_cuenta + historialAccion.costo_total
        const totalDepositado = state.total_depositado + historialAccion.costo_total
        const nuevoHistorialItems = nuevoHistorial(totalCuenta, state.historial)

        const calcularResultadoPrecio = () => {
            const historialPasado: any = sortHistorial(Object.values(nuevoHistorialItems))[1];

            if (historialPasado) return totalCuenta - historialPasado.total

            return totalCuenta
        }
        const resultadoPrecio = calcularResultadoPrecio()

        const nuevosTotales = {
            total_cuenta: totalCuenta,
            historial: nuevoHistorialItems,
            resultado_hoy: {
                precio: resultadoPrecio,
                porcentaje: calcularPorcentaje(resultadoPrecio, totalCuenta)
            },
            resultado_total: {
                precio: totalCuenta - totalDepositado,
                porcentaje: calcularPorcentajeDiferencia(totalCuenta, totalDepositado)
            },
            total_depositado: totalDepositado,
            total_comisiones: +state.total_comisiones + +historialAccion.comision
        }

        dispatch({
            type: ACTUALIZAR_TOTALES,
            payload: nuevosTotales
        })
    }

    const actualizarActividadesRecientes = (accion: AccionType, total: any, cantidad: any) => {
        const nuevaActividad: ActividadRecienteType = {
            ticker: accion.ticker,
            empresa: accion.empresa,
            total,
            cantidad
        }

        dispatch({
            type: ACTUALIZAR_ACTIVIDADES_RECIENTES,
            payload: nuevaActividad as ActividadRecienteType
        })
    }

    const cambiarMoneda = (moneda: 'dolares' | 'pesos') => {
        // TODO: RECIBIR DATA DE API
        const dolar = 180;

        const excludedKeys = ['cantidad', 'diferencia_porcentaje_total', 'diferencia_porcentaje_dia', 'porcentaje']

        const newObject = (object: any) => {
            const clonedObj = Array.isArray(object) ? [...object] : { ...object };
            const entries = Object.entries(clonedObj);

            entries.forEach(([key, value]) => {
                if (typeof value === "object") {
                    clonedObj[key] = newObject(value);
                } else {
                    if (typeof value === 'number' && !excludedKeys.includes(key)) {
                        clonedObj[key] = moneda === 'dolares' ? value / dolar : value * dolar;
                    } else {
                        clonedObj[key] = value;
                    }
                }
            });
            return clonedObj;
        };

        const newstate = newObject(state)

        dispatch({
            type: CAMBIAR_MONEDA,
            payload: newstate
        })
    }

    const actualizarPrecios = async () => {

        if (state.loadingActualizarPrecios) return;

        dispatch({
            type: LOADING_ACTUALIZAR_PRECIOS,
            payload: true
        })

        const userTickers = Object.keys(state.acciones)

        const obtenerPrecios = async () => {
            try {
                const res = await axios.post('http://localhost:3001/obtener-precios', { data: userTickers })
                return res.data.data
            } catch (e) {
                console.log(e)
            }
        }

        const cotizaciones = await obtenerPrecios()

        if (!cotizaciones || cotizaciones === undefined) {
            dispatch({
                type: UNLOADING_ACTUALIZAR_PRECIOS,
                payload: false
            })
            return;
        }

        const nuevasAcciones = { ...state.acciones }

        let nuevoTotalCuenta = 0

        cotizaciones.forEach((el: any) => {
            const accion = nuevasAcciones[el.ticker] as AccionType;
            const cleanedCotizacion = el.cotizacion;
            const cleanedVariacion = el.variacion;
            const nuevoTotalAccion = accion.cantidad * cleanedCotizacion;
            const diferenciaPrecioTotal = nuevoTotalAccion - accion.total_costo
            nuevoTotalCuenta += nuevoTotalAccion;
            accion.precio_unidad = cleanedCotizacion;
            accion.total = nuevoTotalAccion;
            accion.diferencia_porcentaje_total = calcularPorcentajeDiferencia(nuevoTotalAccion, accion.total_costo);
            accion.diferencia_porcentaje_dia = cleanedVariacion;
            accion.diferencia_precio_total = diferenciaPrecioTotal;
            accion.diferencia_precio_dia = (cleanedVariacion * nuevoTotalAccion) / 100;
        })

        const totalHistorialAyer = sortHistorial(Object.values(state.historial))[1]
        const totalAyer = totalHistorialAyer ? totalHistorialAyer.total : 0
        const precioResultadoHoy = totalAyer !== 0 ? nuevoTotalCuenta - totalAyer : nuevoTotalCuenta

        const resultadoHoy = {
            precio: precioResultadoHoy,
            porcentaje: calcularPorcentaje(precioResultadoHoy, nuevoTotalCuenta)
        };
        const resultadoTotal = {
            precio: nuevoTotalCuenta - state.total_depositado,
            porcentaje: calcularPorcentajeDiferencia(nuevoTotalCuenta, state.total_depositado)
        };

        const nuevoHistorialItems = nuevoHistorial(nuevoTotalCuenta, state.historial)

        dispatch({
            type: ACTUALIZAR_PRECIOS,
            payload: {
                historial: nuevoHistorialItems,
                total_cuenta: nuevoTotalCuenta,
                resultado_hoy: resultadoHoy,
                resultado_total: resultadoTotal,
                acciones: nuevasAcciones,
                loadingActualizarPrecios: false
            }
        })


    }

    const eliminarAccionHistorialItem = (ticker: any, position: any) => {

        const accion = { ...state.acciones[ticker] } as AccionType;
        const historialItem = accion.historial[position];

        historialItem.comision = historialItem.comision * -1
        historialItem.costo_total = historialItem.costo_total * -1
        historialItem.costo_unitario = historialItem.costo_unitario * -1
        historialItem.total_accion = historialItem.total_accion * -1
        historialItem.cantidad = historialItem.cantidad * -1

        actualizarTotales(historialItem)
        actualizarActividadesRecientes(accion, historialItem.costo_total, historialItem.cantidad)

        accion.historial = accion.historial.filter((el: any, i: any) => i !== position);

        let acciones = { ...state.acciones }
        // ELIMINAR ACCION
        if (accion.historial.length <= 0) {
            delete acciones[ticker]
        } else {
            acciones[ticker] = actualizarAccion(accion, historialItem)
        }

        dispatch({
            type: ACTUALIZAR_ACCIONES,
            payload: acciones
        })
    }

    const editarAccionHistorialItem = (nuevoHistorialItem: any, ticker: any, position: any) => {

        const accion = { ...state.acciones[ticker] } as AccionType;
        const historialViejo = accion.historial[position] as HistorialAccionItem;

        const handleItemValues = (num1: number, num2: number) => {
            if (num1 < num2 || num1 > num2) {
                return num1 - num2
            }
            return 0
        }

        const historialDiferenciaCostoTotal = handleItemValues(
            nuevoHistorialItem.costo_total,
            historialViejo.costo_total
        );

        const historialDiferencia = {
            fecha: nuevoHistorialItem.fecha,
            cantidad: handleItemValues(
                nuevoHistorialItem.cantidad,
                historialViejo.cantidad
            ),
            costo_unitario: handleItemValues(
                nuevoHistorialItem.costo_unitario,
                historialViejo.costo_unitario
            ),
            costo_total: historialDiferenciaCostoTotal,
            comision: handleItemValues(
                nuevoHistorialItem.comision,
                historialViejo.comision
            ),
            total_accion: accion.total + historialDiferenciaCostoTotal
        };

        const filteredHistorial = accion.historial.filter((el, i) => i !== position);

        accion.historial = sortHistorial([...filteredHistorial, nuevoHistorialItem]);

        actualizarTotales(historialDiferencia)
        actualizarActividadesRecientes(accion, nuevoHistorialItem.costo_total, nuevoHistorialItem.cantidad)

        const nuevaAccion = actualizarAccion(accion, historialDiferencia)

        dispatch({
            type: ACTUALIZAR_ACCION,
            payload: nuevaAccion
        })

    }


    const actualizarAccion =
        (accion: AccionType, historialItem: HistorialAccionItem): AccionType => {
            const nuevaAccion = { ...accion }

            const nuevaCantidad = nuevaAccion.cantidad + historialItem.cantidad;
            const nuevoTotalCosto = nuevaAccion.total_costo + historialItem.costo_total
            const nuevoTotal = nuevaAccion.total + historialItem.costo_total

            nuevaAccion.cantidad = nuevaCantidad
            nuevaAccion.total = nuevoTotal
            nuevaAccion.total_costo = nuevoTotalCosto
            nuevaAccion.ultima_entrada = accion.historial[0].fecha.copy
            nuevaAccion.c_unidad_promedio = (nuevoTotalCosto / nuevaCantidad || 0)
            nuevaAccion.diferencia_porcentaje_total = calcularPorcentajeDiferencia(nuevoTotal, nuevoTotalCosto)
            nuevaAccion.diferencia_precio_total = nuevoTotal - nuevoTotalCosto;

            return nuevaAccion
        }

    return (
        <AccionesContext.Provider value={{
            acciones: state.acciones,
            historial: state.historial,
            actividades_recientes: state.actividades_recientes,
            total_cuenta: state.total_cuenta,
            resultado_hoy: state.resultado_hoy,
            resultado_total: state.resultado_total,
            total_depositado: state.total_depositado,
            total_comisiones: state.total_comisiones,
            loadingActualizarPrecios: state.loadingActualizarPrecios,
            agregarAccion,
            cambiarMoneda,
            actualizarPrecios,
            eliminarAccionHistorialItem,
            editarAccionHistorialItem
        }}>
            {props.children}
        </AccionesContext.Provider>
    )

}

export default AccionesState