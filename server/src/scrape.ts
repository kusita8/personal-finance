import puppeteer from 'puppeteer'


export const scrape = async (tickers = ['AAPL', 'FB']) => {

    const browser = await puppeteer.launch({
        headless: true,
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    const searchpage = "https://www.invertironline.com/mercado/cotizaciones/argentina/cedears/todos"

    await page.goto(searchpage, { waitUntil: 'domcontentloaded' })

    await page.select('#cotizaciones_length select', '-1')

    const cotizaciones = await page.evaluate((tickers) => {
        const acciones = document.querySelectorAll('#cotizaciones > tbody > tr');

        const cotizacionesActuales = []

        for (let i = 0; i < acciones.length; i++) {
            const accion = acciones[i]
            const ticker = accion.querySelector('a > b')?.innerHTML.trim()

            if (ticker && !tickers.includes(ticker)) continue;

            const cotizacion = accion.querySelector('.right.tar')?.innerHTML
            const variacion = accion.querySelector('.text-right > span')?.innerHTML

            cotizacionesActuales.push({ ticker, cotizacion, variacion })
        }

        return cotizacionesActuales
    }, tickers)

    await browser.close()

    return cotizaciones
}