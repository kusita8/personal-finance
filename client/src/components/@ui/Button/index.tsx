import React from 'react'
import { ButtonType } from '../../@types';
import { Icon } from '..'
import './button.scss'

const Button: React.FunctionComponent<ButtonType> = ({ copy_main, copy_second, icon_class, icon, type, icon_class_name, icon_tooltip, ...other }) => {

    return (
        <button className={`button${type ? ` button--${type}` : ''}`} {...other}>
            {copy_second && <span className="button__secondary-copy">{copy_second}</span>}
            {copy_main && copy_main}
            {icon && <Icon className={`${copy_main ? 'button__icon' : ''}${icon_class_name ? ` ${icon_class_name}` : ''}`} icon={icon} />}
            {icon_class && <div className={`${copy_main ? 'button__icon' : ''} ${icon_class}`}></div>}
            {icon_tooltip && <div className="icon__tooltip">{icon_tooltip}</div>}
        </button>
    );
}

export default Button;