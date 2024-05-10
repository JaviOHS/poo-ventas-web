const { log } = require('console');
const {Router} = require('express');
const router = Router(); 
const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' de Node.js
const rutaArchivo = path.join(__dirname, '..', 'json', 'clients.json');

const json_clients = fs.readFileSync(rutaArchivo, 'utf-8')
const clients = JSON.parse(json_clients);

router.get('/', (req, res) => {
    res.render('index', {clients});
});

router.get('/clients/create', (req, res) => {
    res.render('clients/create_clients');
});

router.post('/clients/create', (req, res) => {
    const {dni, nombre, apellido, valor} = req.body;
    if (!dni || !nombre || !apellido || !valor) {
        res.status(400).send('Faltan datos');
        return;
    }
    let newClient = {
        dni, 
        nombre, 
        apellido, 
        valor
    };

    clients.push(newClient);
    const json_clients = JSON.stringify(clients);
    fs.writeFileSync(rutaArchivo, json_clients, 'utf-8');
    res.send('received');
});

router.get('/sales/create', (req, res) => {
    res.render('sales/create_sale');
});
module.exports = router;