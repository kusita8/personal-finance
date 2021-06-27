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

    const [activesortfield, setActiveSortField] = useState('')
    const [activeSort, setActiveSort] = useState(-1)
    const [sortDir, setSortDir] = useState(-1)
    const [sortedAcciones, setSortedAcciones] = useState<any>([])

    const { acciones } = useContext(AccionesContext)

    const handleSort = (field: string, i: number, acciones?: any) => {
        const items = acciones || [...sortedAcciones];
        setActiveSortField(field);

        const sortAcciones = (a: any, b: any, dir = 1) => {
            if (typeof a[field] === 'string') {
                const dateA = new Date(a[field]);

                if (dateA.getTime()) {
                    const dateB = new Date(b[field]);
                    return dateA.getTime() < dateB.getTime() ? 1 * dir : -1 * dir
                }

                return a[field] < b[field] ? 1 * dir : -1 * dir
            } else {
                return a[field] < b[field] ? 1 * dir : -1 * dir
            }
        }

        // si apreta dos veces
        if (i !== -1 && activeSort === i) {
            setSortedAcciones(
                items.sort((a: any, b: any) => sortAcciones(a, b, sortDir))
            )
            setSortDir(sortDir * -1)
            return;
        }

        setActiveSort(i);

        setSortedAcciones(items.sort((a: any, b: any) => sortAcciones(a, b)))
    };

    useEffect(() => {
        const newAcciones = Object.values(acciones);

        console.log({ activesortfield });

        if (activesortfield) {
            handleSort(activesortfield, -1, newAcciones);
        } else {
            setSortedAcciones(newAcciones);
        }
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
                                    icon={activesortfield === el.field ? "chevron_down" : ''}
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