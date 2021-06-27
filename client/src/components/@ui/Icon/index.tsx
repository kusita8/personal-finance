import React from 'react'
import './icon.scss'
const reqSvgs = require.context('../../../static/svg/', true, /\.svg$/)

export interface Props {
    icon: string;
    className?: string;
}

const Icon: React.FunctionComponent<Props> = ({ icon, className }) => {
    return (
        <>
            <img className={className} src={reqSvgs(`./${icon}.svg`).default} alt={icon} />
        </>
    );
}

export default Icon;