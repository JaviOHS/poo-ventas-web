const { log } = require('console');
const {Router} = require('express');
const router = Router(); 
const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' de Node.js
const rutaArchivo = path.join(__dirname, '..', 'json', 'clients.json');
const rutaArchivoProductos = path.join(__dirname, '..', 'json', 'products.json');

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
    const { dni, nombre, apellido, imagen, valor, tipo, tarjeta, numeroTarjeta } = req.body;
    const dniEnUso = await Validaciones.dniExistente(dni);
    
    if (dniEnUso) {
        return res.status(400).json({ error: 'El DNI ya está en uso.' });
    }

    const valorFloat = parseFloat(valor);

    // Convertir el valor de 'tarjeta' a booleano
    const tieneTarjeta = tarjeta === 'si';

    let newClient = {
        id: uuid.v4(),
        dni, 
        nombre, 
        apellido, 
        imagen,
        valor: valorFloat,
        tipo,
        tarjeta: tieneTarjeta, // Guardar como booleano
        numeroTarjeta,
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
    const {dni, nombre, apellido, imagen, valor, tipo, tarjeta, numeroTarjeta} = req.body; // Agregar 'tarjeta' y 'numeroTarjeta' aquí
    const valorFloat = parseFloat(valor);

    // Buscar el cliente por su ID en el array 'clients'
    const clientIndex = clients.findIndex(client => client.id === clientId);
    const tieneTarjeta = tarjeta === 'si';

    if (clientIndex !== -1) {
        // Actualizar los datos del cliente encontrado
        clients[clientIndex] = {
            id: clientId,
            dni, 
            nombre, 
            apellido, 
            imagen,
            valor: valorFloat,
            tipo,
            tarjeta: tieneTarjeta, // Agregar el campo 'tarjeta'
            numeroTarjeta // Agregar el campo 'numeroTarjeta'
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


router.get('/clients/delete', (req, res) => {
    res.render('clients/delete_clients', {clients});
});

router.get('/clients/delete/:id', (req, res) => {
    // Filtra y elimina el cliente con el ID proporcionado de la lista de clientes
    clients = clients.filter(client => client.id !== req.params.id);

    // Guarda la lista actualizada de clientes en el archivo JSON
    const json_clients = JSON.stringify(clients);
    fs.writeFileSync(rutaArchivo, json_clients, 'utf-8');

    router.get('/clients/create', (req, res) => {
        res.render('clients/create_clients');
    });
    res.redirect('/');
});



//----------------RUTA DE CREAR PRODUCTOS----------------
router.get('/products/create', (req, res) => {
    res.render('products/create_products');
});


router.post('/products/create', (req, res) => {
    const { id, descripcion, precio, stock, imagen } = req.body;
    if (!id || !descripcion || !precio || !stock) {
        res.status(400).send('Faltan datos');
        return;
    }

    // Lee los productos del archivo JSON
    const json_products = fs.readFileSync(rutaArchivoProductos, 'utf-8');
    const products = JSON.parse(json_products);

    const newProduct = {
        id,
        descripcion,
        precio,
        stock,
        imagen
    };

    products.push(newProduct);
    const json_updated_products = JSON.stringify(products);
    fs.writeFileSync(rutaArchivoProductos, json_updated_products, 'utf-8');
    res.redirect('/products/create');
});



//----------------RUTA DE EDITAR PRODUCTOS----------------
// Ruta para renderizar la página de actualización de productos
router.get('/products/update', (req, res) => {
    const products = JSON.parse(fs.readFileSync(rutaArchivoProductos, 'utf-8'));
    res.render('products/update_products', { products });
});

// Ruta para actualizar un producto específico
router.post('/products/update/:id', (req, res) => {
    
    const productId = req.params.id;
    const { descripcion, precio, stock, imagen } = req.body;

    // Leer los datos del archivo JSON
    let products = JSON.parse(fs.readFileSync(rutaArchivoProductos, 'utf-8'));

    // Buscar el producto por su ID en el array 'products'
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      // Actualizar los datos del producto encontrado
      products[productIndex] = {
        id: productId,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen
      };

      // Actualizar el archivo JSON con los datos actualizados
      const jsonProducts = JSON.stringify(products);
      fs.writeFileSync(rutaArchivoProductos, jsonProducts, 'utf-8');

      // Redirigir a la página de consulta de productos después de la actualización
      res.redirect('/products/update');
    } else {
      // Si no se encuentra el producto, responder con un error 404
      res.status(404).json({ error: 'Producto no encontrado' });
    }
});




//----------------RUTA DE CONSULTAR PRODUCTOS----------------
router.get('/products/consult', (req, res) => {
    // Leer el archivo JSON de productos
    const json_products = fs.readFileSync(rutaArchivoProductos, 'utf-8');
    const products = JSON.parse(json_products);
    // Renderizar la plantilla 'consult_products' y pasarle la variable 'products'
    res.render('products/consult_products', { products: products });
});

router.get('/products/consult/:id', (req, res) => {
    const productId = req.params.id;
    // Leer el archivo JSON de productos
    const json_products = fs.readFileSync(rutaArchivoProductos, 'utf-8');
    const products = JSON.parse(json_products);
    // Buscar el producto por su ID en el array 'products'
    const product = products.find(product => product.id === productId);
    if (product) {
        // Si se encuentra el producto, enviar sus datos como respuesta
        res.status(200).json(product);
    } else {
        // Si no se encuentra el producto, responder con un error 404
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});



//----------------RUTA DE BORRAR PRODUCTOS----------------
router.get('/products/delet', (req, res) => {
    // Leer el archivo JSON de productos
    const json_products = fs.readFileSync(rutaArchivoProductos, 'utf-8');
    const products = JSON.parse(json_products);

    // Renderizar la plantilla 'delete_products' y pasarle la variable 'products'
    res.render('products/delete_products', { products: products });
});

router.get('/products/delete/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);

    const json_products = fs.readFileSync(rutaArchivoProductos, 'utf-8');
    let products = JSON.parse(json_products);

    // Filtrar y eliminar el producto con el ID proporcionado de la lista de productos
    products = products.filter(product => parseInt(product.id) !== idToDelete);
    console.log('Productos después de la eliminación:', products); // Agregar esta línea para depurar

    // Guardar la lista actualizada de productos en el archivo JSON
    fs.writeFileSync(rutaArchivoProductos, JSON.stringify(products), 'utf-8');

    res.redirect('/products/delet');
});



//----------------RUTA DE CREAR VENTAS----------------
router.get('/sales/create', (req, res) => {
    res.render('sales/create_sale');
});



//----------------RUTA DE ACTUALIZAR VENTAS----------------
router.get('/sales/update', (req, res) => {
    res.render('sales/update_sale');
});


//----------------RUTA DE CONSULTAR VENTAS----------------
router.get('/sales/consult', (req, res) => {
    res.render('sales/consult_sale');
});


//----------------RUTA DE BORRAR VENTAS----------------
router.get('/sales/delete', (req, res) => {
    res.render('sales/delete_sale');
});




module.exports = router;