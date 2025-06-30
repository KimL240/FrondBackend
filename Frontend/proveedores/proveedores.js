const apiURL = "http://localhost:8000/proveedor/"; // dirección donde está corriendo mi API

// Cuando se manda el formulario, detengo que se recargue la página
document.getElementById("proveedorForm").addEventListener("submit", function (e) {
  e.preventDefault(); // que no se reinicie todo
  const nombre_empresa = document.getElementById("nombre_empresa").value; // saco el nombre que pusieron
  const correo = document.getElementById("correo").value; // agarro el correo
  const telefono = document.getElementById("telefono").value; // y el número también

  const nuevoProveedor = { nombre_empresa, correo, telefono }; // armo el paquete para mandarlo

  fetch(apiURL, {
    method: "POST", // voy a crear uno nuevo
    headers: {
      "Content-Type": "application/json" // lo mando como JSON
    },
    body: JSON.stringify(nuevoProveedor) // convierto el objeto a texto plano
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear proveedor"); // si algo falla, lanzo el grito
      return res.json(); // si no, convierto la respuesta
    })
    .then(() => {
      document.getElementById("proveedorForm").reset(); // limpio el formulario
      cargarProveedores(); // recargo la lista para ver el nuevo
    })
    .catch(error => console.error(error)); // si algo falla, lo veo en consola
});

// Función para traer y mostrar todos los proveedores
function cargarProveedores() {
  fetch(apiURL) // pido la lista completa
    .then(res => res.json()) // convierto la respuesta
    .then(proveedores => {
      const contenedor = document.getElementById("proveedores"); // agarro el contenedor
      contenedor.innerHTML = ""; // limpio lo que había antes
      proveedores.forEach(proveedor => {
        const div = document.createElement("div"); // creo un div por proveedor
        div.classList.add("proveedor"); // le pongo clase para estilos
        div.innerHTML = `
          <strong>${proveedor.nombre_empresa}</strong> <!-- nombre con estilo -->
          <span>${proveedor.correo}</span><br /> <!-- su correo -->
          <span>Tel: ${proveedor.telefono}</span> <!-- su número -->
          <div class="acciones">
            <button onclick="editarProveedor(${proveedor.id}, '${proveedor.nombre_empresa}', '${proveedor.correo}', '${proveedor.telefono}')">Editar</button> <!-- para cambiar info -->
            <button class="delete" onclick="eliminarProveedor(${proveedor.id})">Eliminar</button> <!-- para borrar al proveedor -->
          </div>
        `;
        contenedor.appendChild(div); // lo meto al HTML
      });
    })
    .catch(error => console.error("Error al cargar proveedores:", error)); // por si algo sale mal
}

// Función para eliminar proveedor
function eliminarProveedor(id) {
  if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return; // aviso antes de borrar

  fetch(`${apiURL}${id}`, {
    method: "DELETE" // mando la petición de borrar
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar proveedor"); // si falla, aviso
      cargarProveedores(); // actualizo la lista después
    })
    .catch(error => console.error(error)); // si hay error, lo veo en consola
}

// Función para editar proveedor
function editarProveedor(id, nombreActual, correoActual, telefonoActual) {
  const nuevoNombre = prompt("Editar nombre de la empresa:", nombreActual); // pido el nuevo nombre
  const nuevoCorreo = prompt("Editar correo:", correoActual); // pido el nuevo correo
  const nuevoTelefono = prompt("Editar teléfono:", telefonoActual); // y el nuevo teléfono

  if (nuevoNombre && nuevoCorreo && nuevoTelefono) { // si todo está completito
    fetch(`${apiURL}${id}`, {
      method: "PUT", // tipo modificar
      headers: {
        "Content-Type": "application/json" // como JSON
      },
      body: JSON.stringify({
        nombre_empresa: nuevoNombre,
        correo: nuevoCorreo,
        telefono: nuevoTelefono
      }) // mando el paquete actualizado
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar proveedor"); // por si se cae
        return res.json(); // convierto la respuesta
      })
      .then(() => {
        cargarProveedores(); // actualizo la vista
      })
      .catch(error => console.error(error)); // por si explota, lo veo aquí
  }
}

// Cuando se abre la página, cargo los proveedores de una vez
cargarProveedores(); // arranca mostrando lo que ya hay
