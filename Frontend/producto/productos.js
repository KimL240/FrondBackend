const apiURL = "http://localhost:8000/producto/"; // URL donde vive la API de productos

// Cuando se envía el formulario, detengo el refresco de la página
document.getElementById("productoForm").addEventListener("submit", function (e) {
  e.preventDefault(); // esto evita que se recargue todo
  const nombre = document.getElementById("nombre").value; // agarro el nombre que escribieron
  const precio = parseFloat(document.getElementById("precio").value); // convierto el precio a número

  const nuevoProducto = { nombre, precio }; // creo el objeto con lo que se va a enviar

  fetch(apiURL, {
    method: "POST", // tipo de petición: crear nuevo
    headers: {
      "Content-Type": "application/json" // digo que va en formato JSON
    },
    body: JSON.stringify(nuevoProducto) // mando los datos convertidos a texto JSON
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear producto"); // por si algo sale mal
      return res.json(); // convierto la respuesta a JSON
    })
    .then(() => {
      document.getElementById("productoForm").reset(); // limpio el formulario
      cargarProductos(); // actualizo la lista en pantalla
    })
    .catch(error => console.error(error)); // muestro el error en consola si hay
});

// Función que carga todos los productos que ya existen
function cargarProductos() {
  fetch(apiURL) // pido los datos a la API
    .then(res => res.json()) // convierto la respuesta a JSON
    .then(productos => {
      const contenedor = document.getElementById("productos"); // agarro el contenedor de la lista
      contenedor.innerHTML = ""; // limpio lo que había antes
      productos.forEach(producto => {
        const div = document.createElement("div"); // creo el div para cada producto
        div.classList.add("producto"); // le doy clase para estilos
        div.innerHTML = `
          <strong>${producto.nombre}</strong> <!-- nombre del producto en negrita -->
          <span>Precio: $${producto.precio.toFixed(2)}</span> <!-- precio con dos decimales -->
          <div class="acciones">
            <button onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button> <!-- para editar el producto -->
            <button class="delete" onclick="eliminarProducto(${producto.id})">Eliminar</button> <!-- para eliminar el producto -->
          </div>
        `;
        contenedor.appendChild(div); // meto el div en el HTML
      });
    })
    .catch(error => console.error("Error al cargar productos:", error)); // por si algo falla, lo muestro
}

// Función para eliminar un producto
function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return; // confirmo antes de borrarlo

  fetch(`${apiURL}${id}`, {
    method: "DELETE" // le digo que quiero eliminar
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar producto"); // si falla, lanzo error
      cargarProductos(); // actualizo la lista luego de borrar
    })
    .catch(error => console.error(error)); // muestro el error si pasa algo raro
}

// Función para editar un producto
function editarProducto(id, nombreActual, precioActual) {
  const nuevoNombre = prompt("Editar nombre del producto:", nombreActual); // pido el nuevo nombre
  const nuevoPrecio = parseFloat(prompt("Editar precio:", precioActual)); // pido el nuevo precio

  if (nuevoNombre && !isNaN(nuevoPrecio)) { // verifico que no esté vacío y que el precio sea número
    fetch(`${apiURL}${id}`, {
      method: "PUT", // tipo de petición: actualizar
      headers: {
        "Content-Type": "application/json" // va como JSON
      },
      body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio }) // mando los nuevos datos
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar producto"); // por si algo falla
        return res.json(); // convierto la respuesta
      })
      .then(() => {
        cargarProductos(); // actualizo la lista
      })
      .catch(error => console.error(error)); // muestro error si algo sale mal
  }
}

// Apenas se carga la página, se muestran los productos
cargarProductos(); // llama a la función para mostrar lo que hay desde el inicio
