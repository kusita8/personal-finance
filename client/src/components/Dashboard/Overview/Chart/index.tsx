import React, { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from "chart.js";

interface Props {
    data: any;
}

Chart.register(...registerables)
Chart.defaults.font.family = "'Montserrat Alternates', sans-serif";
Chart.defaults.font.size = 12;



const ChartComponent: React.FunctionComponent<Props> = ({ data }) => {

    const chartRef = useRef<any>()

    const [chart, setChart] = useState<any>()

    const getHistorialValues = (hist: any) => {
        return Object.values(hist).sort((a: any, b: any) => a.fecha.time > b.fecha.time ? 1 : -1)
    }

    const getNewLabels = (newHist: any) => {
        return newHist.map((el: any) => el.fecha.copy)
    }

    const getNewData = (newHist: any) => {
        return newHist.map((el: any) => el.total)
    }

    useEffect(() => {
        if (chart) {
            chart.destroy()
        }

        const chartCtx = chartRef.current.getContext("2d") as CanvasRenderingContext2D;

        const historialValues = getHistorialValues(data)

        const newChart = new Chart(chartCtx, {
            type: "line",
            data: {
                //Bring in data
                labels: getNewLabels(historialValues),
                datasets: [
                    {
                        data: getNewData(historialValues),
                        borderColor: '#1AD216',
                    }
                ]
            },
            options: {
                animation: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        padding: 15,
                        caretPadding: 10,
                        cornerRadius: 0,
                        displayColors: false
                    }
                },
                elements: {
                    point: {
                        backgroundColor: '#1AD216',
                        radius: 5,
                        hitRadius: 5,
                    }
                }
            },
        });

        setChart(newChart)

        return () => {
            if (chart) {
                chart.destroy()
            }
        }

    }, [data])


    return (
        <div style={{ position: 'relative', maxWidth: '98%' }}>
            <canvas
                ref={chartRef}
            ></canvas>
        </div>
    );
}

export default ChartComponent;