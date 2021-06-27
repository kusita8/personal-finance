import React, { useContext, useState } from 'react'
import { stopPropagation } from '../../../../utils';
import { Button, Input } from '../../../@ui';
import './statsform.scss'
import cedears from '../../../../static/data/tickers.json'
import { FormItems } from '../../../@types';

import AccionesContext from '../../../../context/acciones/accionesContext'


interface Props {
    setVisibility?: (bool: boolean) => void
}

const tickers = Object.keys(cedears)

const StatsForm: React.FunctionComponent<Props> = ({ setVisibility }) => {

    const [form, setForm] = useState({
        ticker: '',
        empresa: '',
        cantidad: 0,
        costo_u: 0,
        comision: 0,
        date: ''
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue({ [e.target.name]: e.target.value })
    }

    const setFormValue = (newvalues: { [key: string]: any }) => {
        setForm({
            ...form,
            ...newvalues
        })
    }

    const { agregarAccion } = useContext(AccionesContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (setVisibility) setVisibility(false)

        agregarAccion(form)
    }

    return (
        <div className="stats-form" onClick={stopPropagation}>
            <form onSubmit={handleSubmit}>
                <Input
                    key={1}
                    placeholder="TICKER"
                    type="text"
                    name="ticker"
                    options={tickers}
                    onChange={(e) => handleFormChange(e)}
                    setFormValue={(ticker: string) => setFormValue({ ticker, empresa: cedears[ticker as keyof typeof cedears] })}
                    value={form.ticker}
                />
                <Input
                    key={2}
                    placeholder="EMPRESA"
                    type="text"
                    name="empresa"
                    onChange={(e) => handleFormChange(e)}
                    value={form.empresa}
                />
                <Input
                    key={3}
                    placeholder="CANTIDAD"
                    type="number"
                    name="cantidad"
                    onChange={(e) => handleFormChange(e)}
                    value={form.cantidad}
                />
                <Input
                    key={4}
                    placeholder="COSTO U."
                    type="number"
                    name="costo_u"
                    onChange={(e) => handleFormChange(e)}
                    value={form.costo_u}
                />
                <Input
                    key={5}
                    placeholder="COMISION"
                    type="number"
                    name="comision"
                    onChange={(e) => handleFormChange(e)}
                    className="stats-form--last"
                    value={form.comision}
                />
                <Input
                    key={6}
                    placeholder="DATE"
                    label="Deja blanco para hoy."
                    type="date"
                    name="date"
                    onChange={(e) => handleFormChange(e)}
                    className="stats-form--date stats-form--last"
                    value={form.date}
                />
                <Button copy_main="GUARDAR" type='save' />
            </form>
        </div>);
}

export default StatsForm;