import React, { useContext, useState, useEffect } from 'react'
import AccionesContext from '../../../context/acciones/accionesContext'
import { AccionType } from '../../@types'
import { Button, SectionTitle } from '../../@ui'
import Accion from './Accion'
import './acciones.scss'

interface Celda {
    copy: string;
    field: string
}

export interface AccionesProps {
    title: string;
    celdas: Celda[];
    acciones: any[]
}

interface Props {
    data: AccionesProps;
}

const Acciones: React.FunctionComponent<Props> = ({ data }) => {

    const [activeSort, setActiveSort] = useState(-1)
    const [sortDir, setSortDir] = useState(-1)
    const [sortedAcciones, setSortedAcciones] = useState<any>([])

    const { acciones } = useContext(AccionesContext)

    const handleSort = (field: string, i: number) => {

        const sortAcciones = (a: any, b: any, dir = 1) => {
            if (typeof a[field] === 'string') {
                return a[field] < b[field] ? -1 * dir : 1 * dir
            } else {
                return a[field] < b[field] ? 1 * dir : -1 * dir
            }
        }

        // si apreta dos veces
        if (activeSort === i) {
            setSortedAcciones([...sortedAcciones].sort((a: any, b: any) =>
                sortAcciones(a, b, sortDir)))
            setSortDir(sortDir * -1)
            return;
        }

        setActiveSort(i);

        setSortedAcciones(sortedAcciones.sort((a: any, b: any) => sortAcciones(a, b)))
    };

    useEffect(() => {
        setSortedAcciones(Object.values(acciones))
    }, [acciones])

    return (
        <div className="acciones">
            <SectionTitle title={data.title} />

            <table className="table">
                <tbody>
                    <tr className="table__titles">
                        {data.celdas.map((el, i) => (
                            <th key={el.field}>
                                <Button
                                    icon={activeSort === i ? "chevron_down" : ''}
                                    type="th"
                                    copy_main={el.copy}
                                    onClick={() => handleSort(el.field, i)}
                                />
                            </th>
                        ))}
                        <th></th>
                    </tr>
                    {sortedAcciones.map((el: AccionType) => (
                        <Accion key={el.ticker} data={el} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Acciones;