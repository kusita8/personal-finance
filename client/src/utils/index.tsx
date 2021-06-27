import { FormatNumberType } from "../components/@types"

export const listenOutsideClick = (cb: () => void) => {
    const pageClickCallback = () => {
        cb()
        document.removeEventListener('click', pageClickCallback)
    }
    document.addEventListener('click', pageClickCallback)

    return true
}

export const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();

export const obtenerFecha = (date?: string) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (!date) {
        const d = new Date()
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    } else {
        const d = date.split('-')
        return `${+d[2]} ${months[+d[1] - 1 as any]} ${d[0]}`
    }
}

export const formatNumber = (num: number, type?: FormatNumberType) =>
    formatNumberDots((Math.round(num * 100) / 100), type);

export const formatNumberDots = (num: string | number, type?: FormatNumberType) => {
    const numArr = num.toString().split('.')
    const number = numArr[0]
    const numberLenght = number.length - 1
    let formatedText = ''
    for (let i = 0; i <= numberLenght; i++) {
        if (i !== 0 && number[Math.abs(i - numberLenght)] !== '-' && i % 3 === 0) {
            formatedText = '.' + formatedText
        }
        formatedText = number[Math.abs(i - numberLenght)] + formatedText
    }

    const text = formatedText + (numArr[1] ? `,${numArr[1]}` : '')

    if (type === 'porcentaje') {
        return `${text}%`
    } else if (type === 'number_with_sign') {
        return `${num < 0 ? '-' : '+'}$${text.replace(/\-/, '')}`
    } else if (type === 'porcentaje_with_sign')
        return `${num < 0 ? '-' : '+'}${text.replace(/\-/, '')}%`
    else {
        return `${num < 0 ? '-' : ''}$${text.replace(/\-/, '')}`
    }
}

export const cleanReceivedNumber = (num: string) => parseFloat(num.replace(/\./, '').replace(/\,/, '.'))

export const nuevoHistorial = (total: any, historiales: any) => {
    const fecha = obtenerFecha();

    if (historiales[fecha]) {
        historiales[fecha].total = total
        return historiales
    }

    return {
        [fecha]: {
            fecha: {
                copy: fecha,
                time: new Date(fecha).getTime()
            },
            total
        },
        ...historiales
    }
}

export const calcularPorcentaje = (num1: number, num2: number) => {
    return ((100 * num1) / num2 || 0)
}

export const calcularPorcentajeDiferencia = (num1: number, num2: number) =>
    calcularPorcentaje(num1, num2) - 100


export const sortHistorial = (values: any) => {
    return values.sort((a: any, b: any) => a.fecha.time < b.fecha.time ? 1 : -1)
}


export const convertToNumber = (object: any) => {
    const clonedObj = Array.isArray(object) ? [...object] : { ...object };
    const entries = Object.entries(clonedObj);

    entries.forEach(([key, value]) => {
        if (typeof value === "object") {
            clonedObj[key] = convertToNumber(value);
        } else {
            if (typeof value === 'string' && !isNaN(value as any) && !isNaN(+value)) {
                clonedObj[key] = +value;
            } else {
                clonedObj[key] = value;
            }
        }
    });
    return clonedObj;
};