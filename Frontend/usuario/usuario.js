const apiURL = "http://localhost:8000/usuario/"; // la ruta donde está mi API de usuarios

// Cuando se envía el formulario, detengo que se recargue todo
document.getElementById("usuarioForm").addEventListener("submit", function (e) {
  e.preventDefault(); // pa' que no se me refresque la página
  const nombre = document.getElementById("nombre").value; // agarro el nombre
  const apellido = document.getElementById("apellido").value; // el apellido también
  const edad = parseInt(document.getElementById("edad").value); // convierto la edad a número
  const correo = document.getElementById("correo").value; // saco el correo

  const nuevoUsuario = { nombre, apellido, edad, correo }; // armo el objeto con toda la info

  fetch(apiURL, {
    method: "POST", // le digo a la API que quiero agregar uno nuevo
    headers: {
      "Content-Type": "application/json" // lo mando en formato JSON
    },
    body: JSON.stringify(nuevoUsuario) // convierto el objeto a texto plano
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear usuario"); // por si algo se rompe
      return res.json(); // convierto la respuesta a JSON
    })
    .then(() => {
      document.getElementById("usuarioForm").reset(); // limpio los campos del form
      cargarUsuarios(); // actualizo la lista para que se vea el nuevo
    })
    .catch(error => console.error(error)); // si algo falla, lo muestro
});

// Función que trae y pinta todos los usuarios
function cargarUsuarios() {
  fetch(apiURL) // pido los datos a la API
    .then(res => res.json()) // convierto la respuesta a JSON
    .then(usuarios => {
      const contenedor = document.getElementById("usuarios"); // agarro el div donde van los usuarios
      contenedor.innerHTML = ""; // lo limpio antes de pintar
      usuarios.forEach(usuario => {
        const div = document.createElement("div"); // creo un div por usuario
        div.classList.add("usuario"); // le meto la clase para los estilos
        div.innerHTML = `
          <strong>${usuario.nombre} ${usuario.apellido}</strong> <!-- nombre completo en negrita -->
          <span>Edad: ${usuario.edad}</span><br /> <!-- su edad -->
          <span>Correo: ${usuario.correo}</span> <!-- el correo -->
          <div class="acciones">
            <button onclick="editarUsuario(${usuario.id}, '${usuario.nombre}', '${usuario.apellido}', ${usuario.edad}, '${usuario.correo}')">Editar</button> <!-- para modificar -->
            <button class="delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button> <!-- para borrar -->
          </div>
        `;
        contenedor.appendChild(div); // lo meto en el contenedor
      });
    })
    .catch(error => console.error("Error al cargar usuarios:", error)); // por si algo falla
}

// Función para borrar a alguien
function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return; // por si se arrepienten

  fetch(`${apiURL}${id}`, {
    method: "DELETE" // le digo que lo elimine
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar usuario"); // si algo falla
      cargarUsuarios(); // actualizo la lista después de borrar
    })
    .catch(error => console.error(error)); // muestro el error
}

// Función para editar la info de alguien
function editarUsuario(id, nombreActual, apellidoActual, edadActual, correoActual) {
  const nuevoNombre = prompt("Editar nombre:", nombreActual); // pido nuevo nombre
  const nuevoApellido = prompt("Editar apellido:", apellidoActual); // nuevo apellido
  const nuevaEdad = parseInt(prompt("Editar edad:", edadActual)); // nueva edad
  const nuevoCorreo = prompt("Editar correo:", correoActual); // nuevo correo

  // solo si todo tiene algo y la edad es número
  if (nuevoNombre && nuevoApellido && !isNaN(nuevaEdad) && nuevoCorreo) {
    fetch(`${apiURL}${id}`, {
      method: "PUT", // tipo actualización
      headers: {
        "Content-Type": "application/json" // va como JSON
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        apellido: nuevoApellido,
        edad: nuevaEdad,
        correo: nuevoCorreo
      }) // mando el paquete actualizado
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar usuario"); // si algo truena
        return res.json(); // convierto la respuesta
      })
      .then(() => {
        cargarUsuarios(); // actualizo la lista en pantalla
      })
      .catch(error => console.error(error)); // muestro cualquier error
  }
}

// Cuando se abre la página, cargo la lista de una vez
cargarUsuarios(); // primer render de usuarios
