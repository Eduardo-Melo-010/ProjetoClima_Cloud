const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Aplicação simples rodando em Docker e Kubernetes!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});