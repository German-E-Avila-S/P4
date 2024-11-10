---SERVER.JS
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const mysql = require('mysql2');

// Configurar conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '14082004chimin', // Cambia por tu contraseña
  database: 'gestion_pacientes'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Ruta para guardar datos en la base de datos
app.post('/submit-data', (req, res) => {
  const { name, age, heart_rate } = req.body;

  const query = 'INSERT INTO pacientes (nombre, edad, frecuencia_cardiaca) VALUES (?, ?, ?)';
  connection.query(query, [name, age, heart_rate], (err, result) => {
    if (err) {
      return res.send('Error al guardar los datos en la base de datos.');
    }
    res.send(`Paciente ${name} guardado en la base de datos.`);
  });
});

// Ruta para mostrar los datos de la base de datos
app.get('/pacientes', (req, res) => {
  connection.query('SELECT * FROM pacientes', (err, results) => {
    if (err) {
      return res.send('Error al obtener los datos.');
    }
    res.send(results);
  });
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
