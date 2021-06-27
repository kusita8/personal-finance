import React from 'react'
import './sectiontitle.scss'

export interface Props {
    title: string;
    subtitle?: string;
    type?: string;
    className?: string;
}

const SectionTitle: React.FunctionComponent<Props> = ({ title, subtitle, type, className }) => {
    return (
        <div className={`section-title ${type ? `section-title--${type}` : ''}${className ? ` ${className}` : ''}`}>
            <h2>{title}</h2>
            {subtitle && <h6>{subtitle}</h6>}
        </div>
    );
}

export default SectionTitle;