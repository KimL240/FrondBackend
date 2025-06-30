const apiURL = "http://localhost:8000/proveedor/";

document.getElementById("proveedorForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre_empresa = document.getElementById("nombre_empresa").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;

  const nuevoProveedor = { nombre_empresa, correo, telefono };

  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoProveedor)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear proveedor");
      return res.json();
    })
    .then(() => {
      document.getElementById("proveedorForm").reset();
      cargarProveedores();
    })
    .catch(error => console.error(error));
});

function cargarProveedores() {
  fetch(apiURL)
    .then(res => res.json())
    .then(proveedores => {
      const contenedor = document.getElementById("proveedores");
      contenedor.innerHTML = "";
      proveedores.forEach(proveedor => {
        const div = document.createElement("div");
        div.classList.add("proveedor");
        div.innerHTML = `
          <strong>${proveedor.nombre_empresa}</strong>
          <span>${proveedor.correo}</span><br />
          <span>Tel: ${proveedor.telefono}</span>
          <div class="acciones">
            <button onclick="editarProveedor(${proveedor.id}, '${proveedor.nombre_empresa}', '${proveedor.correo}', '${proveedor.telefono}')">Editar</button>
            <button class="delete" onclick="eliminarProveedor(${proveedor.id})">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => console.error("Error al cargar proveedores:", error));
}

function eliminarProveedor(id) {
  if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;

  fetch(`${apiURL}${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar proveedor");
      cargarProveedores();
    })
    .catch(error => console.error(error));
}

function editarProveedor(id, nombreActual, correoActual, telefonoActual) {
  const nuevoNombre = prompt("Editar nombre de la empresa:", nombreActual);
  const nuevoCorreo = prompt("Editar correo:", correoActual);
  const nuevoTelefono = prompt("Editar teléfono:", telefonoActual);

  if (nuevoNombre && nuevoCorreo && nuevoTelefono) {
    fetch(`${apiURL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre_empresa: nuevoNombre,
        correo: nuevoCorreo,
        telefono: nuevoTelefono
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar proveedor");
        return res.json();
      })
      .then(() => {
        cargarProveedores();
      })
      .catch(error => console.error(error));
  }
}

// Mostrar los proveedores al cargar la página
cargarProveedores();