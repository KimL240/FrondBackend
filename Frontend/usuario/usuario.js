const apiURL = "http://localhost:8000/usuario/";

document.getElementById("usuarioForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const edad = parseInt(document.getElementById("edad").value);
  const correo = document.getElementById("correo").value;

  const nuevoUsuario = { nombre, apellido, edad, correo };

  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoUsuario)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear usuario");
      return res.json();
    })
    .then(() => {
      document.getElementById("usuarioForm").reset();
      cargarUsuarios();
    })
    .catch(error => console.error(error));
});

function cargarUsuarios() {
  fetch(apiURL)
    .then(res => res.json())
    .then(usuarios => {
      const contenedor = document.getElementById("usuarios");
      contenedor.innerHTML = "";
      usuarios.forEach(usuario => {
        const div = document.createElement("div");
        div.classList.add("usuario");
        div.innerHTML = `
          <strong>${usuario.nombre} ${usuario.apellido}</strong>
          <span>Edad: ${usuario.edad}</span><br />
          <span>Correo: ${usuario.correo}</span>
          <div class="acciones">
            <button onclick="editarUsuario(${usuario.id}, '${usuario.nombre}', '${usuario.apellido}', ${usuario.edad}, '${usuario.correo}')">Editar</button>
            <button class="delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => console.error("Error al cargar usuarios:", error));
}

function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

  fetch(`${apiURL}${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar usuario");
      cargarUsuarios();
    })
    .catch(error => console.error(error));
}

function editarUsuario(id, nombreActual, apellidoActual, edadActual, correoActual) {
  const nuevoNombre = prompt("Editar nombre:", nombreActual);
  const nuevoApellido = prompt("Editar apellido:", apellidoActual);
  const nuevaEdad = parseInt(prompt("Editar edad:", edadActual));
  const nuevoCorreo = prompt("Editar correo:", correoActual);

  if (nuevoNombre && nuevoApellido && !isNaN(nuevaEdad) && nuevoCorreo) {
    fetch(`${apiURL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        apellido: nuevoApellido,
        edad: nuevaEdad,
        correo: nuevoCorreo
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar usuario");
        return res.json();
      })
      .then(() => {
        cargarUsuarios();
      })
      .catch(error => console.error(error));
  }
}

// Mostrar usuarios al cargar la página
cargarUsuarios();