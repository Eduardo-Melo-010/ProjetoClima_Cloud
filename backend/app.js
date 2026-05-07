const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

function traduzirCodigoClima(code) {
  const codigos = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com geada",
    51: "Garoa fraca",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    80: "Pancadas de chuva fracas",
    81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva fortes",
    95: "Trovoada"
  };

  return codigos[code] || "Condição climática não identificada";
}

app.get("/weather", async (req, res) => {
  try {
    const cidade = req.query.city || "Recife";

    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({
        erro: "Cidade não encontrada"
      });
    }

    const local = geoResponse.data.results[0];

    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=auto`
    );

    const atual = weatherResponse.data.current_weather;

    res.json({
      cidade: local.name,
      estado: local.admin1 || "",
      pais: local.country || "",
      latitude: local.latitude,
      longitude: local.longitude,
      temperatura: `${atual.temperature}°C`,
      vento: `${atual.windspeed} km/h`,
      clima: traduzirCodigoClima(atual.weathercode),
      horario: atual.time
    });

  } catch (error) {
    res.status(500).json({
      erro: "Erro ao consultar a previsão do tempo",
      detalhe: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Backend rodando na porta 3000");
});