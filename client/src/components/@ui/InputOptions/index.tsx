import { FormItems } from '../../@types';
import './inputoptions.scss'

export interface Props {
    options: string[],
    value: string | undefined | number;
    onOptionClick: (formitems: string) => void
    onClick?: () => void;
}

const InputOptions: React.FunctionComponent<Props> = ({ options, value, onOptionClick }) => {

    const filterOptions = (option: string) => !value || typeof value === 'number' ? true :
        option.slice(0, value.length).toLocaleLowerCase() == value.toLocaleLowerCase();

    return (
        <div className="input__options">
            {options.filter(filterOptions).map(el => (
                <div key={el} className="input__option-elem" onClick={() => onOptionClick(el)}>
                    {el}
                </div>
            ))}
        </div>);
}

export default InputOptions;