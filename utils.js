const fetch = require('node-fetch')

const key = process.env.API_KEY

const getWeatherData = async city => {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`)
    const weather = await data.json()
    const myWeather = {}

    const tempString = await getTempString(weather.main.temp)
    const speed = weather.wind.speed
    const degrees = weather.wind.deg
    const wind = await getWind(speed, degrees)
    const sunrise = await timestampToTime(weather.sys.sunrise)
    const sunset = await timestampToTime(weather.sys.sunset)

    myWeather.city = weather.name
    myWeather.temp = tempString
    myWeather.wind = wind
    myWeather.sunrise = sunrise
    myWeather.sunset = sunset

    // return weather
    return myWeather
}

const timestampToTime = async timestamp => {
    const date = new Date(timestamp * 1000)
    const ending = date.getHours() > 12 ? 'PM' : 'AM'
    const time = date.toLocaleTimeString().slice(0,4)

    return `${time} ${ending}`
}

const getTempString = async temperature => {
    return `${Math.round(temperature)}\xB0F`
}

const getWind = async (speed, degrees) => {
    try {
        const windSpeed = Math.round(speed)
        let direction
        switch(true) {
            case degrees == 0 || degrees == 360:
                direction = 'N'
                break
            case degrees > 314:
                direction = 'NW'
                break
            case degrees > 269:
                direction = 'W'
                break
            case degrees > 224:
                direction = 'SW'
                break
            case degrees > 179:
                direction = 'S'
                break
            case degrees > 134:
                direction = 'SE'
                break
            case degrees > 89:
                direction = 'E'
                break
            case degrees > 44:
                direction = 'NE'
                break
        }
        return `${windSpeed}mph ${direction}`
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    getWeatherData
}