const apiURL = "http://localhost:8000/producto/";

document.getElementById("productoForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);

  const nuevoProducto = { nombre, precio };

  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoProducto)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear producto");
      return res.json();
    })
    .then(() => {
      document.getElementById("productoForm").reset();
      cargarProductos();
    })
    .catch(error => console.error(error));
});

function cargarProductos() {
  fetch(apiURL)
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById("productos");
      contenedor.innerHTML = "";
      productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
          <strong>${producto.nombre}</strong>
          <span>Precio: $${producto.precio.toFixed(2)}</span>
          <div class="acciones">
            <button onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button>
            <button class="delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => console.error("Error al cargar productos:", error));
}

function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  fetch(`${apiURL}${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar producto");
      cargarProductos();
    })
    .catch(error => console.error(error));
}

function editarProducto(id, nombreActual, precioActual) {
  const nuevoNombre = prompt("Editar nombre del producto:", nombreActual);
  const nuevoPrecio = parseFloat(prompt("Editar precio:", precioActual));

  if (nuevoNombre && !isNaN(nuevoPrecio)) {
    fetch(`${apiURL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar producto");
        return res.json();
      })
      .then(() => {
        cargarProductos();
      })
      .catch(error => console.error(error));
  }
}

// Mostrar productos al cargar la página
cargarProductos();