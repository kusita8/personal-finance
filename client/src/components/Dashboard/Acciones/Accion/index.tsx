import React, { useState } from 'react'
import { formatNumber } from '../../../../utils';
import { AccionType, FormatNumberType } from '../../../@types';
import { Button } from '../../../@ui'
import HistorialItem from '../HistorialItem';
import './accion.scss'

export interface Props {
    data: AccionType;
}

const Accion: React.FunctionComponent<Props> = ({ data }) => {

    const [history, setHistory] = useState(false)

    const getNumberClassName = (num: number) => {
        const classes = [
            num > 0 && 'number--positive',
            num < 0 && 'number--negative',
            num === 0 && 'number--neutral'
        ]
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <tr key={data.ticker} className="table__item" role="button" onClick={() => setHistory(!history)}>
                <td><div className="ticker">{data.ticker}</div></td>
                <td>{data.empresa}</td>
                <td>{data.ultima_entrada}</td>
                <td>{data.cantidad}</td>
                <td>{formatNumber(data.c_unidad_promedio)}</td>
                <td>{formatNumber(data.precio_unidad)}</td>
                <td>{formatNumber(data.total_costo)}</td>
                <td>{formatNumber(data.total)}</td>
                <td className={getNumberClassName(data.diferencia_porcentaje_dia)}>
                    {formatNumber(data.diferencia_porcentaje_dia, 'porcentaje_with_sign')}
                </td>
                <td className={getNumberClassName(data.diferencia_porcentaje_total)}>
                    {formatNumber(
                        data.diferencia_porcentaje_total,
                        'porcentaje_with_sign'
                    )}
                </td>
                <td className={getNumberClassName(data.diferencia_precio_dia)}>
                    {formatNumber(data.diferencia_precio_dia, 'number_with_sign')}
                </td>
                <td className={getNumberClassName(data.diferencia_precio_total)}>
                    {formatNumber(data.diferencia_precio_total, 'number_with_sign')}
                </td>
                <td className="table__icon">
                    <Button
                        icon="chevron_down"
                        type="icon"
                    />
                </td>
            </tr>
            <tr className={`table__history table__history--${history ? 'active' : 'hidden'}`}>
                <td colSpan={13} className="history_wrapper">
                    <table style={{ height: history ? `${27 + 48 * data.historial.length}px` : '0px' }}>
                        <tbody>
                            <tr className="history__titles">
                                <th></th>
                                <th className="history-cell--1">FECHA</th>
                                <th className="history-cell--2">CANTIDAD</th>
                                <th className="history-cell--3">COSTO U.</th>
                                <th className="history-cell--4">COSTO T.</th>
                                <th className="history-cell--5">COMISION</th>
                                <th></th>
                                <th></th>
                            </tr>
                            {data.historial.map((historialItem: any, i: any) => (
                                <HistorialItem
                                    key={Math.random() * 6000}
                                    data={historialItem}
                                    ticker={data.ticker}
                                    index={i}
                                />
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        </>);
}

export default Accion;