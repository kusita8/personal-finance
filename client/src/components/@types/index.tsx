export interface ButtonType {
    icon?: string,
    copy_main?: string,
    copy_second?: string
    icon_class?: string,
    on_click?: string,
    type?: string,
    onClick?: () => void,
    button_type?: string,
    options?: string[],
    icon_class_name?: string,
    icon_tooltip?: string
}

export interface CardType {
    icon: string,
    copy: string,
    number: string | number,
    type?: string
}

export interface FormItems {
    ticker: string,
    empresa: string,
    cantidad: number,
    costo_u: number,
    comision: number,
    date: string;
}

export interface ActividadRecienteType {
    ticker: string,
    empresa: string,
    cantidad: number,
    total: number,
}

interface Fecha {
    copy: string;
    time: number
}

export interface HistorialAccionItem {
    fecha: Fecha,
    cantidad: number,
    costo_unitario: number,
    costo_total: number,
    comision: number,
    total_accion: number
}

export interface HistorialTotalItem {
    fecha: Fecha,
    total: number
}

export interface AccionType {
    ticker: string,
    empresa: string,
    cantidad: number
    historial: HistorialAccionItem[],
    total: number,
    total_costo: number
    precio_unidad: number
    ultima_entrada: string,
    c_unidad_promedio: number,
    diferencia_porcentaje_total: number,
    diferencia_porcentaje_dia: number,
    diferencia_precio_total: number
    diferencia_precio_dia: number
}

export interface Action {
    type?: string;
    payload?: any;
}

interface PrecioConPorcentaje {
    porcentaje: 0,
    precio: 0
}

export interface AccionesStateType {
    acciones: any,
    actividades_recientes: ActividadRecienteType[],
    historial: any,
    total_cuenta: number,
    resultado_hoy: PrecioConPorcentaje,
    resultado_total: PrecioConPorcentaje,
    total_depositado: number,
    total_comisiones: number,
    loadingActualizarPrecios: boolean
}

export type FormatNumberType = 'porcentaje' | 'number' | 'number_with_sign' | 'porcentaje_with_sign'