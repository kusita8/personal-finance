import { Icon, SectionTitle } from '../../@ui'
import { ActividadRecienteType, CardType } from '../../@types'
import './sidebar.scss'
import { useContext } from 'react'
import AccionesContext from '../../../context/acciones/accionesContext'
import AnimatePresence from '../../@ui/AnimatePresence'
import { formatNumber } from '../../../utils'


export interface SidebarProps {
    actividades: {
        title: string,
        items: ActividadRecienteType[]
    },
    stats: {
        title: string,
        items: CardType[]
    }
}

export interface Props {
    data: SidebarProps
}

const Sidebar: React.FunctionComponent<Props> = ({ data }) => {

    const { total_comisiones, actividades_recientes } = useContext(AccionesContext)

    const otherStatsNumbers = {
        "Total comisiones": formatNumber(total_comisiones)
    }
    return (
        <aside className="sidebar">
            <div className="sidebar__actividades">
                <SectionTitle title={data.actividades.title} type={'sm'} />

                <ul className="actividades">
                    <AnimatePresence
                        from={{ transform: 'translateX(-100%)', opacity: '0' }}
                        to={{ transform: 'translateX(0)', opacity: '1' }}
                    >
                        {actividades_recientes.map(el => (
                            <li key={Math.random() * 6000} className="actividades__item" style={{ backgroundColor: 'red' }}>
                                <div className="actividades__ticker">
                                    {el.ticker}
                                </div>
                                <div className="actividades__copy">
                                    <p>{el.empresa}</p>
                                    <span>{el.cantidad} acciones</span>
                                </div>
                                <div className={`actividades__number number--${el.total < 0 ? 'negative' : 'positive'}`}>
                                    {formatNumber(el.total, 'number_with_sign')}
                                </div>
                            </li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
            <div className="sidebar__stats">
                <SectionTitle
                    title={data.stats.title}
                    type='sm'
                    className="sidebar__stats-title"
                />

                <ul className="other-stats">
                    {data.stats.items.map(el => (
                        <li key={el.icon} className="other-stats__item">
                            <div className="other-stats__icon">
                                <Icon icon={el.icon} />
                            </div>
                            <div className="other-stats__copy">{el.copy}</div>
                            <div className="other-stats__number">{otherStatsNumbers[el.copy as keyof typeof otherStatsNumbers]}</div>
                        </li>
                    ))}
                </ul>

            </div>
        </aside>
    );
}

export default Sidebar;