const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '..', 'public') // ou pode ser '../public'
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Carregando as funções Geocode e Forecast
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')





// Setup handlebars engine and views location
app.set('view engine', 'hbs')                 // setting up hbs (handlebars, module installed) - for dynamic templates
app.set('views', viewsPath)                   // informando em qual pasta estão os templates do site.
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))  // Essa função fornece a página principal em html

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rafael Muniz'
    })                                        // the name "index" needs to match up the name of the file you want to send to the browser
})


//Loading "about.hbs" page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Rafael Muniz'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        content: 'FAQ',
        name: 'Rafael Muniz'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a city name'
        })
    }
    city = req.query.address
    geocode(city, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({
                    error: error
                })
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: city
            })
        })
    })
   
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console .log(req.query.search)
    res.send({
        products: []
    })
})


// Error message for pages inside "help"
app.get('/help/*', (req, res) => {
    res.render('404help', {
        title: '404',
        name: 'Rafael Muniz',
        errorMessage: 'Help article not found'
    })
})

// 404 page not found (error)
app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        name: 'Rafael Muniz',
        title: '404'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})