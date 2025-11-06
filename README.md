# Nest Crud Course

Este proyecto es una simulación de un carrito de compras desarrollado con Nuxt + Vue y Nest JS. En este README se detalla el desarrollo del lado del Back-End.
Proporciona al Front-End la API REST para manejar productos, usuarios y carritos.

## Instrucciones de setup

1. Clonar el repositorio:

```bash
git clone https://github.com/AdriQuiz/nest-crud-course.git
cd nest-crud-course
```

2. Instalar dependencias y crear .env

```bash
npm install
```

Se consideran estas URLs de ejemplo, la URI de mongoDB debe reemplazarse con la correcta.

```bash
touch .env
MONGODB_URI=<URI_MONGODB_ATLAS>
```

### Librerías usadas
- **mongoose:** Para el manejo de base de datos en MongoDB Atlas.

3. Ejecución del backend:

```bash
npm run start:dev
```

El servidor se va a ejecutar en:

```bash
http://localhost:3000
```

## Endpoints Principales

### Interfaz base

Aquí se encuentran tres opciones:

1. Acceder al CRUD de productos
2. Acceder al CRUD de usuarios
3. Acceder al carrito de un usuario insertando el ID del mismo

### Usuarios

1. Listar usuarios

Con esta URL, se listan todos los usuarios en la BD.
Retorna una lista de usuarios.

```bash
GET http://localhost:3000/users 
```

2. Crear usuario

Con esta URL, se crea un usuario nuevo en la BD.
Se mostrará un formulario con los campos nombre, email y contraseña para ingresar.
Retorna los datos del usuario creado.

```bash
POST http://localhost:3000/users
```

3. Actualizar usuario

Con esta URL, se actualiza un usuario nuevo en la BD.
Se mostrará un formulario con los campos nombre, email y contraseña para ingresar.
Se retorna el usuario actualizado o null.

```bash
PUT http://localhost:3000/users/:id
```

4. Eliminar usuario

Con esta URL, se elimina un usuario de la BD en base al ID.
Con un solo click se eliminará el usuario.
Retorna un valor true o false.

```bash
DELETE http://localhost:3000/users/:id
```

5. Obtener un usuario

Con esta URL, se encuentra un usuario por su ID.
Retorna un usuario o null.

```bash
GET http://localhost:3000/users/:id
```

### Productos

1. Listar productos

Con esta URL, se listan todos los productos en la BD.
Retorna una lista de productos.

```bash
GET http://localhost:3000/products
```

2. Crear producto

Con esta URL, se crea un producto nuevo en la BD.
Se mostrará un formulario con los campos nombre, precio y stock para ingresar.
Retorna el nuevo producto.

```bash
POST http://localhost:3000/products
```

3. Actualizar producto

Con esta URL, se actualiza un producto nuevo en la BD.
Se mostrará un formulario con los campos nombre, precio y stock para ingresar.
Retorna el producto actualizado o null.

```bash
PUT http://localhost:3000/products/:id
```

4. Eliminar producto

Con esta URL, se elimina un producto de la BD en base al ID.
Con un solo click se eliminará el producto.
Retorna un valor true o false.

```bash
DELETE http://localhost:3000/products/:id
```

5. Obtener un producto

Con esta URL, se encuentra un producto por su ID.
Retorna un producto o null.

```bash
GET http://localhost:3000/products/:id
```

### Carrito

1. Listar items del carrito

Con esta URL, se listan todos los items que selecciona el usuario.
Retorna una lista de items del carrito.

```bash
GET http://localhost:3000/cart?userId=123
```

Nota: Se usa query params para pasar el ID especificado por el usuario para ver su carrito.

2. Añadir item al carrito

Con esta URL, se añade un item al carrito.
Se mostrará una lista con productos y se podrá seleccionar para el carrito.
Retorna un item de carrito.

```bash
POST http://localhost:3000/cart
```

3. Actualizar item del carrito

Con esta URL, se actualiza la cantidad de un item del carrito.
Se debe especificar la cantidad que se quiere.
Retorn el item de carrito o null.

```bash
PUT http://localhost:3000/cart/:id
```

4. Eliminar item del carrito

Con esta URL, se elimina un item del carrito del usuario según su ID.
Retorna un valor true o false.

```bash
DELETE http://localhost:3000/cart/:id
```