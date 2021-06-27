import { Action, AccionesStateType } from '../../components/@types'
import { AGREGAR_ACCION, ACTUALIZAR_TOTALES, ACTUALIZAR_ACTIVIDADES_RECIENTES, CAMBIAR_MONEDA, HYDRATE_STATE, ACTUALIZAR_PRECIOS, LOADING_ACTUALIZAR_PRECIOS, UNLOADING_ACTUALIZAR_PRECIOS, ACTUALIZAR_ACCIONES, ACTUALIZAR_ACCION, NEW_DAY } from '../type'


export default function Reducer(state: AccionesStateType, action: Action) {
    switch (action.type) {

        case HYDRATE_STATE:
        case CAMBIAR_MONEDA:
            return action.payload

        case AGREGAR_ACCION:
            return {
                ...state,
                acciones: { ...state.acciones, [action.payload.ticker]: action.payload },
            }

        case ACTUALIZAR_TOTALES:
        case NEW_DAY:
            return {
                ...state,
                ...action.payload
            }

        case ACTUALIZAR_ACTIVIDADES_RECIENTES:
            return {
                ...state,
                actividades_recientes: [
                    action.payload,
                    ...state.actividades_recientes
                ]
            }

        case ACTUALIZAR_PRECIOS:
            return {
                ...state,
                historial: action.payload.historial,
                total_cuenta: action.payload.total_cuenta,
                resultado_hoy: action.payload.resultado_hoy,
                resultado_total: action.payload.resultado_total,
                acciones: action.payload.acciones,
                loadingActualizarPrecios: action.payload.loadingActualizarPrecios
            }

        case LOADING_ACTUALIZAR_PRECIOS:
        case UNLOADING_ACTUALIZAR_PRECIOS:
            return {
                ...state,
                loadingActualizarPrecios: action.payload
            }

        case ACTUALIZAR_ACCIONES:
            return {
                ...state,
                acciones: action.payload
            }

        case ACTUALIZAR_ACCION:
            return {
                ...state,
                acciones: { ...state.acciones, [action.payload.ticker]: action.payload }
            }

        default:
            return state
    }

}