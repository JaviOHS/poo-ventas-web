const { log } = require('console');
const {Router} = require('express');
const router = Router(); 
const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' de Node.js
const rutaArchivo = path.join(__dirname, '..', 'json', 'clients.json');
const { esCedulaValida, soloNumeros, soloLetras, soloDecimales } = require('../public/js/validaciones');
const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
// const { mostrarExito, mostrarError, mostrarConfirmacion } = require('../public/js/sweet_alert');
const Swal = require('sweetalert2');

const json_clients = fs.readFileSync(rutaArchivo, 'utf-8')
let clients = JSON.parse(json_clients);


// RUTAS PRINCIPALES 
router.get('/', (req, res) => {
    res.render('index', {clients});
});

router.get('/gestion_clientes', (req, res) => {
    res.render('gestion_clientes', {clients});
});

router.get('/gestion_productos', (req, res) => {
    res.render('gestion_productos', {clients});
});

router.get('/gestion_ventas', (req, res) => {
    res.render('gestion_ventas', {clients});
});

router.get('/login', (req, res) => {
    res.render('login', {clients});
});

router.get('/exit', (req, res) => {
    res.render('exit', {clients});
});

// RUTAS DE MODULOS 
router.get('/clients/create', (req, res) => {
    res.render('clients/create_clients');
});

router.post('/clients/create', (req, res) => {
    const {dni, nombre, apellido, imagen, valor, tipo} = req.body;
    const valorFloat = parseFloat(valor);
    let newClient = {
        id: uuid.v4(),
        dni, 
        nombre, 
        apellido, 
        imagen,
        valor: valorFloat,
        tipo
    };

    clients.push(newClient);
    const json_clients = JSON.stringify(clients);
    fs.writeFileSync(rutaArchivo, json_clients, 'utf-8');
    res.redirect('/clients/create');
});

router.get('/clients/update', (req, res) => {
    res.render('clients/update_clients');
});

router.get('/clients/consult', (req, res) => {
    res.render('clients/consult_clients', {clients});
});

router.get('/clients/delete/:id', (req, res) => {
    // Filtra y elimina el cliente con el ID proporcionado de la lista de clientes
    clients = clients.filter(client => client.id !== req.params.id);

    // Guarda la lista actualizada de clientes en el archivo JSON
    const json_clients = JSON.stringify(clients);
    fs.writeFileSync(rutaArchivo, json_clients, 'utf-8');

    // Redirige a la página de inicio
    res.redirect('/');
});

router.get('/clients/delete', (req, res) => {
    res.render('clients/delete_clients', {clients});
});
module.exports = router;