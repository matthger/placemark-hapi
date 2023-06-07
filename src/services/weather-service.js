import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const weatherService = {
    weatherUrl: "https://api.openweathermap.org/data/2.5/weather",

    async getWeather(lat, lng) {
        if (!this.isLatitude(lat) || !this.isLongitude(lng)) return null;
        const res = await axios.get(`${this.weatherUrl}?lat=${lat}&lon=${lng}&appid=${process.env.weather_key}&units=metric`);
        for (let i = 0; i < res.data.weather.length; i++) {
            res.data.weather[i].icon = `http://openweathermap.org/img/w/${res.data.weather[i].icon}.png`;
        }
        return res.data;
    },

    async getWeatherInfos(placemarks) {
        for (let i = 0; i < placemarks.length; i++) {
            let weatherInfo = await this.getWeather(placemarks[i].lat, placemarks[i].lng);
            if (weatherInfo) {
                placemarks[i].weather = weatherInfo.weather[0];
                placemarks[i].temp = weatherInfo.main;
                placemarks[i].temp.temp = Math.round(placemarks[i].temp.temp);
            }
        }
        return placemarks;
    },

    isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
    },

    isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
    }
};
