const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${server.address().port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
