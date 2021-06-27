import React from 'react'
import { InputOptions } from '..'
import './input.scss'
import { FormItems } from '../../@types'

export interface Props {
    placeholder?: string;
    type: string;
    className?: string;
    name?: string;
    value?: string | number;
    options?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormValue?: (formitems: string) => void,
    label?: string;
}

const Input: React.FunctionComponent<Props> = ({ placeholder, className, name, type, options, value, label, setFormValue, ...other }) => {

    return (
        <div className={`input${className ? ` ${className}` : ''}`}>
            <input value={value} type={type} name={name} id={name} placeholder=" " autoComplete="off" {...other} />
            {placeholder && <label htmlFor={placeholder}>{placeholder}</label>}
            {options && setFormValue &&
                <InputOptions
                    value={value}
                    options={options}
                    onOptionClick={setFormValue}
                />
            }
            {label && <span className="input__label">{label}</span>}
        </div>
    );
}

export default Input;