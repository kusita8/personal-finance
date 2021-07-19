import express from 'express'
import fs from 'fs'
import { scrape } from './scrape'
var request = require('request');

const cors = require('cors');

const app = express();

app.enable('trust proxy');

app.options('*', cors());

app.use(cors());

app.use(express.json());

app.post('/save', (req, res) => {
    const jsondata = JSON.stringify(req.body)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const d = new Date()

    const filename = `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`

    fs.writeFile(`data/${filename}.json`, jsondata, 'utf8', function (err) {
        if (err) return res.send(err)

        console.log('saved to:', filename)
        res.send('DATA SAVED')
    });
})

app.get('/backup', (req, res) => {

    fs.readdir('data', (direrr, files) => {
        if (direrr) {
            return res.status(404).json({
                status: 'error',
                error: direrr
            })
        }
        const filenames = files.map(el => el.split('.')[0])
        const filename = filenames.reduce((acc, cur) => {
            if (!acc || new Date(cur).getTime() >= new Date(acc).getTime()) {
                return cur
            } else {
                return acc
            }
        }, '');

        fs.readFile(`data/${filename}.json`, 'utf8', function (err, data) {
            if (err) {
                return res.status(404).json({
                    status: 'error',
                    error: err
                })
            }

            console.log(`using version backup version: ${filename}`)

            res.status(200).json({
                status: 'success',
                data: JSON.parse(data)
            })
        });
    });

})

app.get('/clear', (req, res) => {
    fs.rmdirSync('data', { recursive: true });
    res.send('cleared');
})

app.post('/obtener-precios', async (req: express.Request, res) => {
    const { data } = req.body;

    const getAcciones = () => new Promise((resolve) => {
        request({
            url: "https://www.cohen.com.ar/Financial/ListCotizacion",
            method: "POST",
            headers: {
                "Cache-Control": 'no-cache',
                "content-type": "application/json",
                "Accept": '*/*',
            },
            body: JSON.stringify({
                "grupo": "CEDEARS",
                "especieTipo": "",
                "campoOrden": "SIMBOLO",
                "sentidoOrden": "ASC",
                "lenguajeCultura": "es-AR",
            })
        }, (_: any, __: any, body: any) => {
            return resolve(JSON.parse(body))
        })
    })

    try {
        const acciones = await getAcciones() as any;

        const cotizaciones = [] as any[];

        acciones.CotizacionList.forEach((el: any) => {
            const ticker = el.Simbolo.split(' - ')[0];

            if (data.includes(ticker)) {
                const cotizacion = el.PrecioUltimo;
                const variacion = el.Variacion.toFixed(2) * 1;

                cotizaciones.push({
                    ticker,
                    cotizacion,
                    variacion
                });
            }
        })

        res.status(200).json({
            status: 'success',
            data: cotizaciones
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            error: e
        });
    }
})

app.get('/', async (req: express.Request, res) => {
    res.send('Online');
});

const port = 3001;

app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}...`);
});