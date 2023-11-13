const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(express.static('public'));

// Configura multer para guardar los archivos cargados en la carpeta 'uploads'
const upload = multer({ dest: 'uploads/' });

app.get('*', (req, res) => {
  const requestedPath = path.join(__dirname, req.path);

  fs.stat(requestedPath, (err, stats) => {
    if (err) {
      res.status(404).send('Archivo no encontrado');
    } else if (stats.isDirectory()) {
      fs.readdir(requestedPath, (err, files) => {
        if (err) {
          res.status(500).send('Error al leer el directorio');
        } else {
          res.send(files.join('<br>'));
        }
      });
    } else {
      res.sendFile(requestedPath);
    }
  });
});

// Ruta para cargar archivos
app.post('/upload', upload.single('file'), (req, res) => {
    // req.file contiene información sobre el archivo cargado
    console.log(req.file);
  
    // Envía una respuesta al cliente con la ruta del archivo
    res.send({ path: '/uploads/' + req.file.filename });
  });

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});