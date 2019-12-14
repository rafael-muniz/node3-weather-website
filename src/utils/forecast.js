const request = require('request')

const forecast = (latitude, longitude, callback) => {
 const url = 'https://api.darksky.net/forecast/8359d4af6ad974ea62d9b41930b1d09d/' + latitude + ',' + longitude + '?units=si&lang=pt'

 request({ url, json: true }, (error, {body}) => { // o normal seria (error, response)
 
    if (error) {
        callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
        callback('Unable to find location', undefined)
    } else {
        const temp = body.currently.temperature
        const pp = body.currently.precipProbability
        const summary = body.daily.data[0].summary
        const tempMax = body.daily.data[0].temperatureHigh
        const tempMin = body.daily.data[0].temperatureLow

        callback(undefined, summary + ' It is currently ' + temp + ' degress out, with minimum of ' + tempMin + ' degrees and maximum of ' + tempMax + ' degress today. There is a ' + pp + '% chance of rain.')
    }    
 })
}

module.exports = forecast