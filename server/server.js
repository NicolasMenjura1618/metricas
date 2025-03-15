// server/server.js
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
