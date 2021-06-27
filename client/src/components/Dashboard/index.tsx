import './dashboard.scss'
import Overview, { OverviewProps } from './Overview'
import Sidebar, { SidebarProps } from './Sidebar'
import Stats, { StatProps } from './Stats'
import Acciones, { AccionesProps } from './Acciones'

export interface Props {
    data: {
        stats: StatProps,
        acciones: AccionesProps,
        overview: OverviewProps,
        sidebar: SidebarProps,
    }
}

const Dashboard: React.FunctionComponent<Props> = ({ data }) => {
    return (
        <main className="dashboard">
            <div className="dashboard__top section-spacer-bottom">
                <div className="dashboard__main-content">
                    <Stats data={data.stats} />
                    <Overview data={data.overview} />
                </div>
                <Sidebar data={data.sidebar} />
            </div>
            <Acciones data={data.acciones} />
        </main>
    );
}

export default Dashboard;