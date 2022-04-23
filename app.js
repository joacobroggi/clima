const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

let ciudadApi = "";
let climaApi = "";
let temperaturaApi = "";
let sensacionApi = "";
let humedadApi = "";
let casoApi = "";
let imgApi = "";
let casoClima = "";
let casoSensacion = "";

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const key = "e254cb1103df5557916f9cb77e61228d";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=metric&appid=" +
    key +
    "&lang=sp";
  ciudadApi = req.body.cityName;

  https.get(url, function (respuesta) {
    respuesta.on("data", function (data) {
      const wheatherData = JSON.parse(data);

      console.log(wheatherData.weather[0]);
      let temp = wheatherData.main.temp;
      let sensacion = wheatherData.main.feels_like;
      let humedad = wheatherData.main.humidity;
      let clima = wheatherData.weather[0].description;
      let casoOut = wheatherData.weather[0].main;
      let icon = wheatherData.weather[0].icon;
      let caso = "";
      let img = "";

      switch (casoOut) {
        case "Clouds":
          img = "nubes";
          caso = "fas fa-cloud";
          break;

        case "Rain":
          img = "lluvia";
          caso = "fas fa-cloud-rain";
          break;
        case "Thunderstorm":
          img = "tormenta";
          caso = "fas fa-cloud-bolt";
          break;
        case "Clear":
          img = "despejado";
          caso = "ec ec-low-brightness";
          break;
        case "Snow":
          img = "nieve";
          caso = "fas fa-snowflake";
          break;
        case "Haze":
          img = "niebla";
          caso = "fas fa-smog";
          break;
        default:
          console.log("algo salio mal");
          break;
      }

      if (temp > 25) {
        casoClima = "fa-solid fa-temperature-arrow-up tempAlta";
      } else if (temp < 12) {
        casoClima = "fa-solid fa-temperature-arrow-down tempBaja";
      } else {
        casoClima = "fa-solid fa-temperature-half tempMedia";
      }

      if (sensacion > 25) {
        casoSensacion = "ec ec-hot";
      } else if (temp < 12) {
        casoSensacion = "ec ec-cold";
      } else {
        casoSensacion = "ec ec-slightly-smiling-face";
      }

      climaApi = clima;
      temperaturaApi = temp;
      sensacionApi = sensacion;
      humedadApi = humedad;
      casoApi = caso;
      casoClimaApi = casoClima;
      imgApi = img;
      casoSensacionApi = casoSensacion;

      res.redirect("/clima");
    });
  });
});

app.get("/clima", function (req, res) {
  res.render("clima", {
    ciudadApi: ciudadApi,
    climaApi: climaApi,
    temperaturaApi: temperaturaApi,
    sensacionApi: sensacionApi,
    humedadApi: humedadApi,
    casoApi: casoApi,
    imgApi: imgApi,
    casoClimaApi: casoClimaApi,
    casoSensacionApi: casoSensacionApi,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
