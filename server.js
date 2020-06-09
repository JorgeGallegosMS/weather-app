require('dotenv').config()
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const utils = require('./utils')

const port = process.env.PORT

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', async (req, res) => {
    try {
        let weather = req.query.city ? await utils.getWeatherData(req.query.city) : await utils.getWeatherData('San Francisco')
        console.log(weather)
        
        res.render('home', { weather })
    } catch (err){
        console.error(err)
    }
})
// Erase this route when done testing
app.get('/data', async (req, res) => {
    try {
        const weather = await utils.getWeatherData('San Francisco')
        if (weather.cod == 200){
            // res.render('home', { weather })
            res.send(weather)
        } else {
            res.send(weather.message)
        }
    } catch (err){
        console.error(err)
    }
})

// app.post('/search', (req, res) => {
//     console.log(req.body.city)
// })

app.listen(port, () => console.log(`Server started on port ${port}`))