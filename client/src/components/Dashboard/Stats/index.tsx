import { useContext, useState } from 'react'
import { SectionTitle, Button, Card, Select } from '../../@ui'
import { ButtonType, CardType } from '../../@types'
import './stats.scss'
import { listenOutsideClick, stopPropagation } from '../../../utils'
import StatsForm from './StatsForm'
import AccionesContext from '../../../context/acciones/accionesContext'

export interface StatProps {
    title: string,
    subtitle: string,
    buttons: ButtonType[],
    cards: CardType[]
}

interface Props {
    data: StatProps
}

const Stats: React.FunctionComponent<Props> = ({ data }) => {

    const [add, setAdd] = useState(false)

    const { total_cuenta, resultado_hoy, resultado_total, total_depositado, loadingActualizarPrecios, cambiarMoneda, actualizarPrecios } = useContext(AccionesContext)

    const getAttr = (attr: string, value: string | undefined) => {
        const attrs: any = {}

        const buttonActions: any = {
            'agregar': () => setAdd(!add),
            'currency': (moneda: any) => cambiarMoneda(moneda.toLowerCase()),
            'actualizar': () => actualizarPrecios(),
            'rotate-animation': loadingActualizarPrecios ? 'rotate-animation' : ''
        }

        if (typeof value !== 'undefined' && value !== null && buttonActions[value]) {
            attrs[attr] = buttonActions[value]
        }
        return attrs
    }

    const resultadosNumbers = {
        "Total Cuenta": total_cuenta,
        "Resultado Hoy": resultado_hoy,
        "Resultado Total": resultado_total,
        "Total Depositado": total_depositado
    }

    return (
        <div className="stats section-spacer-bottom">

            <div className="stats__top">
                <SectionTitle title={data.title} subtitle={data.subtitle} />

                <div className="stats__buttons" onClick={stopPropagation}>
                    {data.buttons.map(el => {
                        if (el.button_type === 'select') {
                            return <Select
                                key={el.copy_main}
                                name={el.copy_main || ''}
                                options={el.options || []}
                                copy_second={el.copy_second || ''}
                                {...getAttr('onChange', el.on_click)}
                            />
                        } else {
                            return <Button
                                key={el.copy_main}
                                copy_main={el.copy_main}
                                copy_second={el.copy_second}
                                icon_class={el.icon_class}
                                icon={el.icon}
                                type={el.type}
                                {...getAttr('onClick', el.on_click)}
                                {...getAttr('icon_class_name', el.icon_class_name)}
                            />
                        }
                    })}
                </div>

                {add && listenOutsideClick(() => setAdd(false)) &&
                    <StatsForm setVisibility={setAdd} />
                }

            </div>

            <div className="stats__bottom">
                {data.cards.map(el => (
                    <Card
                        key={el.icon}
                        icon={el.icon}
                        copy={el.copy}
                        number={resultadosNumbers[el.copy as keyof typeof resultadosNumbers]}
                        type={el.type}
                    />
                ))}
            </div>

        </div>
    );
}

export default Stats;