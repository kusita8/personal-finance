import React from 'react'
import './iconlink.scss'

export interface Props {
    src: string;
    alt: string;
}

const IconLink: React.FunctionComponent<Props> = ({ src, alt }) => {

    return (
        <div className="icon-link icon-link--active">
            <img src={src} alt={alt} />
        </div>
    );
}

export default IconLink;