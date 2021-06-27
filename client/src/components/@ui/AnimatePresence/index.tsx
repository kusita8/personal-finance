import React, { memo, useEffect, useRef, useState } from 'react'

export interface Props {
    children?: React.ReactNode[];
    delay?: number
    from?: React.CSSProperties,
    to?: React.CSSProperties
}

const AnimatePresence = memo(({ delay, from, to, children }: Props) => {

    const animate = useRef<HTMLDivElement>(null)

    const [nodes, setNodes] = useState<React.ReactNode[]>()


    useEffect(() => {
        if (!children || children.length <= 0) return;

        if (animate !== null && animate.current !== null) {
            const estiloInicial: React.CSSProperties[] = []
            const posicionInicial = "translate(0,-100%)"

            // CALCULAR POSICION VIEJA DE CADA NODE
            if (animate.current.children.length > 0) {
                for (let i = 0; i < animate.current.children.length; i++) {
                    estiloInicial.push({
                        transform: posicionInicial
                    })
                }
            }

            // AGREGAR POSICION INICIAL DEL NUEVO ELEMENTO
            estiloInicial.unshift(from || {
                transform: posicionInicial,
                opacity: '0'
            })


            // AGREGAR POSICIONES INICIALES A TODOS LOS NODOS
            const newchildren = children.map((el, i) => {
                if (React.isValidElement(el)) {
                    return React.cloneElement(el, {
                        style: estiloInicial[i]
                    });
                }
                return el
            })

            // AGREGAR CHILDREN CON POSICIONES INICIALES AL DOM
            setNodes(newchildren)

            // SACAR POSICIONES INICIALES PARA QUE SE ANIMEN A SU NUEVA POSICION
            setTimeout(() => {
                if (!animate.current) return;

                const nodes = animate.current!.children as HTMLCollection;

                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i] as HTMLElement
                    if (i === 0 && to) {
                        if (to) node.style.cssText = `${Object.entries(to).map(([k, v]) => `${k}:${v}`).join(';')}`
                        continue;
                    }
                    node.style.transform = "translate(0,0)"
                    node.style.opacity = "1"
                }

            }, delay || 50)

        }

    }, [children])

    return (<><div style={{ overflow: 'hidden' }} ref={animate}>{nodes}</div></>);
})

export default AnimatePresence;



