import React from 'react'
import { formatNumber } from '../../../utils';
import { CardType } from '../../@types';
import './card.scss'
const reqSvgs = require.context('../../../static/svg/', true, /\.svg$/)


const Card: React.FunctionComponent<CardType> = ({ icon, copy, number, type }) => {
    return (
        <div className="card">
            <img src={reqSvgs(`./${icon}.svg`).default} alt="" />
            <p>{copy}</p>
            {!type ? <span>{formatNumber(number as number)}</span> :
                Object.entries(number).map(el => {
                    if (el[0] === 'porcentaje') {
                        return <div key={Math.random() * 6000} className="card__porcentaje">
                            {formatNumber(el[1], 'porcentaje_with_sign')}
                        </div>
                    } else {
                        return <span key={Math.random() * 6000}>{formatNumber(el[1], 'number_with_sign')}</span>
                    }

                })
            }
        </div>
    );
}

export default Card;