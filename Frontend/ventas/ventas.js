const apiURL = "http://localhost:8000/venta/"; // mi punto de conexión con la API

// Evento para cuando se envía el formulario de ventas
document.getElementById("ventaForm").addEventListener("submit", function (e) {
  e.preventDefault(); // evito que se recargue la página
  const fecha = document.getElementById("fecha").value; // saco la fecha que pusieron

  const nuevaVenta = { fecha }; // armo el objeto para enviarlo

  fetch(apiURL, {
    method: "POST", // tipo de petición: agregar
    headers: {
      "Content-Type": "application/json" // lo mando en formato JSON
    },
    body: JSON.stringify(nuevaVenta) // convierto el objeto a texto plano
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear venta"); // por si algo sale mal
      return res.json(); // convierto la respuesta a JSON
    })
    .then(() => {
      document.getElementById("ventaForm").reset(); // limpio el formulario
      cargarVentas(); // actualizo la lista de ventas
    })
    .catch(error => console.error(error)); // muestro el error si pasa algo
});

// Función para cargar todas las ventas
function cargarVentas() {
  fetch(apiURL) // pido la lista a la API
    .then(res => res.json()) // convierto la respuesta a JSON
    .then(ventas => {
      const contenedor = document.getElementById("ventas"); // agarro el contenedor
      contenedor.innerHTML = ""; // limpio lo que había antes
      ventas.forEach(venta => {
        const div = document.createElement("div"); // creo un div por venta
        div.classList.add("venta"); // le doy clase para estilos
        div.innerHTML = `
          <strong>ID: ${venta.id}</strong> <!-- muestro el ID -->
          <span>Fecha: ${new Date(venta.fecha).toLocaleDateString()}</span> <!-- convierto la fecha para que se vea decente -->
          <div class="acciones">
            <button onclick="editarVenta(${venta.id}, '${venta.fecha}')">Editar</button> <!-- para modificar la fecha -->
            <button class="delete" onclick="eliminarVenta(${venta.id})">Eliminar</button> <!-- para borrar la venta -->
          </div>
        `;
        contenedor.appendChild(div); // meto el div al HTML
      });
    })
    .catch(error => console.error("Error al cargar ventas:", error)); // por si algo truena
}

// Función para eliminar una venta
function eliminarVenta(id) {
  if (!confirm("¿Seguro que deseas eliminar esta venta?")) return; // confirmo con el usuario

  fetch(`${apiURL}${id}`, {
    method: "DELETE" // le digo a la API que borre
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar venta"); // si algo falla, lo lanzo
      cargarVentas(); // actualizo la lista después de borrar
    })
    .catch(error => console.error(error)); // muestro errores si hay
}

// Función para editar la fecha de la venta
function editarVenta(id, fechaActual) {
  const nuevaFecha = prompt("Editar fecha:", fechaActual); // pido la nueva fecha al usuario

  if (nuevaFecha) { // si puso algo
    fetch(`${apiURL}${id}`, {
      method: "PUT", // tipo de petición: actualizar
      headers: {
        "Content-Type": "application/json" // mando como JSON
      },
      body: JSON.stringify({ fecha: nuevaFecha }) // mando el nuevo dato
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar venta"); // por si falla
        return res.json(); // convierto respuesta
      })
      .then(() => {
        cargarVentas(); // actualizo la lista para reflejar el cambio
      })
      .catch(error => console.error(error)); // por si algo explota
  }
}

// Cargo las ventas al entrar a la página
cargarVentas(); // arranco con la lista ya en pantalla
