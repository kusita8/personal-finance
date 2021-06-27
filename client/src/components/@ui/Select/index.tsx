import React, { useState } from 'react'
import { Icon } from '..'
import './select.scss'

export interface Props {
    name: string;
    placeholder?: string;
    options: string[],
    copy_second?: string;
    onChange?: (e: any) => void
}

const Select: React.FunctionComponent<Props> = ({ name, placeholder, copy_second, options, onChange, ...other }) => {

    const [selectwidth, setSelectWidth] = useState('48px')

    const handleOnChange = (e: any) => {
        const selectoptions = e.target.options

        const newText = selectoptions[selectoptions.selectedIndex].text;

        const newWidth = newText.length * 9.9;

        setSelectWidth(`${newWidth}px`)

        if (onChange) onChange(newText)
    }

    return (
        <div className="select">
            {copy_second && <span className="select__secondary-copy">{copy_second}</span>}
            <select style={{ width: selectwidth }} name={name} id={name} onChange={handleOnChange} {...other}>
                {placeholder &&
                    <option value={placeholder}>
                        {placeholder}
                    </option>
                }
                {options.map(el => (
                    <option key={el}>{el}</option>
                ))}
            </select>
            <Icon icon="chevron_down" />
        </div>
    );
}

export default Select;