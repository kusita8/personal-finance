import React, { useContext } from 'react'
import { SectionTitle } from '../../@ui';
import Chart from './Chart';
import './overview.scss'
import AccionesContext from '../../../context/acciones/accionesContext';

export interface OverviewProps {
    title: string;
}

interface Props {
    data: OverviewProps;
}

const Overview: React.FunctionComponent<Props> = ({ data }) => {

    const { historial } = useContext(AccionesContext)

    return (
        <div className="overview">
            <SectionTitle title={data.title} className="overview__title" />
            <Chart key={Math.random() * 6000} data={historial} />
        </div>
    );
}

export default Overview;