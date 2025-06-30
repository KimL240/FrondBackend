const apiURL = "http://localhost:8000/venta/";

document.getElementById("ventaForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;

  const nuevaVenta = { fecha };

  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaVenta)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear venta");
      return res.json();
    })
    .then(() => {
      document.getElementById("ventaForm").reset();
      cargarVentas();
    })
    .catch(error => console.error(error));
});

function cargarVentas() {
  fetch(apiURL)
    .then(res => res.json())
    .then(ventas => {
      const contenedor = document.getElementById("ventas");
      contenedor.innerHTML = "";
      ventas.forEach(venta => {
        const div = document.createElement("div");
        div.classList.add("venta");
        div.innerHTML = `
          <strong>ID: ${venta.id}</strong>
          <span>Fecha: ${new Date(venta.fecha).toLocaleDateString()}</span>
          <div class="acciones">
            <button onclick="editarVenta(${venta.id}, '${venta.fecha}')">Editar</button>
            <button class="delete" onclick="eliminarVenta(${venta.id})">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => console.error("Error al cargar ventas:", error));
}

function eliminarVenta(id) {
  if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;

  fetch(`${apiURL}${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar venta");
      cargarVentas();
    })
    .catch(error => console.error(error));
}

function editarVenta(id, fechaActual) {
  const nuevaFecha = prompt("Editar fecha:", fechaActual);

  if (nuevaFecha) {
    fetch(`${apiURL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fecha: nuevaFecha })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar venta");
        return res.json();
      })
      .then(() => {
        cargarVentas();
      })
      .catch(error => console.error(error));
  }
}

// Mostrar las ventas al cargar la página
cargarVentas();