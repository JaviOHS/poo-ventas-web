const { log } = require('console');
const {Router} = require('express');
const router = Router(); 
const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' de Node.js
const rutaArchivo = path.join(__dirname, '..', 'json', 'clients.json');
const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
const Validaciones = require('../public/js/validaciones');

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
router.get('/clients', (req, res) => {
  fs.readFile(rutaArchivo, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const clients = JSON.parse(data);
    res.json(clients);
  });
});

router.get('/clients/create', (req, res) => {
    res.render('clients/create_clients');
});

router.post('/clients/create', async (req, res) => {
    const {dni, nombre, apellido, imagen, valor, tipo} = req.body;
    const dniEnUso = await Validaciones.dniExistente(dni);
    
    if (dniEnUso) {
        return res.status(400).json({ error: 'El DNI ya está en uso.' });
    }

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
    res.render('clients/update_clients', {clients});
});

router.post('/clients/update/:id', (req, res) => {
    const clientId = req.params.id;
    const {dni, nombre, apellido, imagen, valor, tipo} = req.body;
    const valorFloat = parseFloat(valor);

    // Buscar el cliente por su ID en el array 'clients'
    const clientIndex = clients.findIndex(client => client.id === clientId);

    if (clientIndex !== -1) {
        // Mantener el mismo DNI del cliente existente
        const existingDNI = clients[clientIndex].dni;

        // Actualizar los datos del cliente encontrado
        clients[clientIndex] = {
            id: clientId,
            dni: existingDNI,  // Mantener el mismo DNI
            nombre, 
            apellido, 
            imagen,
            valor: valorFloat,
            tipo
        };

        // Actualizar el archivo JSON con los datos actualizados
        const json_clients = JSON.stringify(clients);
        fs.writeFileSync(rutaArchivo, json_clients, 'utf-8');

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Cliente actualizado correctamente' });
    } else {
        // Si no se encuentra el cliente, responder con un error 404
        res.status(404).json({ error: 'Cliente no encontrado' });
    }
});

router.get('/clients/consult', (req, res) => {
    res.render('clients/consult_clients', {clients});
});

router.get('/clients/consult/:id', (req, res) => {
    const clientId = req.params.id;
    
    // Buscar el cliente por su ID en el array 'clients'
    const client = clients.find(client => client.id === clientId);

    if (client) {
        // Si se encuentra el cliente, enviar sus datos como respuesta
        res.status(200).json(client);
    } else {
        // Si no se encuentra el cliente, responder con un error 404
        res.status(404).json({ error: 'Cliente no encontrado' });
    }
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