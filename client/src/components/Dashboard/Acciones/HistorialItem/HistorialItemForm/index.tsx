import React, { useContext, useState } from 'react'
import AccionesContext from '../../../../../context/acciones/accionesContext';
import { convertToNumber } from '../../../../../utils';
import { Input } from '../../../../@ui';
import './historialitemform.scss'

export interface Props {
    data: any;
    ticker: any;
    index: any
}

const HistorialItemForm: React.FunctionComponent<Props> = ({ data, ticker, index }) => {

    const { editarAccionHistorialItem } = useContext(AccionesContext)


    const [form, setForm] = useState({
        fecha: data.fecha.copy,
        cantidad: data.cantidad,
        costo_unitario: data.costo_unitario,
        costo_total: data.costo_total,
        comision: data.comision
    })

    const setFormValue = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()

        const cleanedForm = convertToNumber(form)

        const historialItem = {
            ...cleanedForm,
            fecha: {
                copy: cleanedForm.fecha,
                time: new Date(cleanedForm.fecha).getTime()
            },
        }

        editarAccionHistorialItem(historialItem, ticker, index)
    }

    return (
        <form className="historial-item-form" onSubmit={handleSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td className="history-cell--1">
                            <Input
                                type="text"
                                value={form.fecha}
                                name="fecha"
                                onChange={(e) => setFormValue(e)}
                            />
                        </td>
                        <td className="history-cell--2">
                            <Input
                                type="number"
                                value={form.cantidad}
                                name="cantidad"
                                onChange={(e) => setFormValue(e)}
                            />
                        </td>
                        <td className="history-cell--3">
                            <Input
                                type="number"
                                value={form.costo_unitario}
                                name="costo_unitario"
                                onChange={(e) => setFormValue(e)}
                            />
                        </td>
                        <td className="history-cell--4">
                            <Input
                                type="number"
                                value={form.costo_total}
                                name="costo_total"
                                onChange={(e) => setFormValue(e)}
                            />
                        </td>
                        <td className="history-cell--5">
                            <Input
                                type="number"
                                value={form.comision}
                                name="comision"
                                onChange={(e) => setFormValue(e)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button className="hidden"></button>
        </form>
    );
}

export default HistorialItemForm;