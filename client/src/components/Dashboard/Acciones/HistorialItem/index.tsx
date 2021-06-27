import React, { memo, useContext, useState } from 'react'
import AccionesContext from '../../../../context/acciones/accionesContext';
import { formatNumber } from '../../../../utils';
import { Button } from '../../../@ui';
import HistorialItemForm from './HistorialItemForm';

export interface Props {
    data: any;
    index: any;
    ticker: any
}

const HistorialItem: React.FunctionComponent<Props> = memo(({ data, index, ticker }) => {

    const [editar, setEditar] = useState(false)
    const { eliminarAccionHistorialItem } = useContext(AccionesContext)

    return (
        <tr className="history__item">
            <td></td>

            {editar ?
                <td colSpan={5} className="history__item-wrapper">
                    <HistorialItemForm data={data} ticker={ticker} index={index} />
                </td>
                :
                <td colSpan={5} className="history__item-wrapper">
                    <table>
                        <tbody>
                            <tr>
                                <td className="history-cell--1">{data.fecha.copy}</td>
                                <td className="history-cell--2">{data.cantidad}</td>
                                <td className="history-cell--3">{formatNumber(data.costo_unitario)}</td>
                                <td className="history-cell--4">{formatNumber(data.costo_total)}</td>
                                <td className="history-cell--5">{formatNumber(data.comision)}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            }
            <td>
                <div className="fl sb">
                    <Button
                        key={50}
                        icon='pencil'
                        icon_tooltip="Editar"
                        onClick={() => setEditar(!editar)}
                    />
                    <Button
                        key={51}
                        icon='nuke'
                        icon_tooltip="Eliminar"
                        onClick={() => eliminarAccionHistorialItem(ticker, index)}
                    />
                </div>
            </td>
            <td></td>
        </tr>
    );
})

export default HistorialItem;