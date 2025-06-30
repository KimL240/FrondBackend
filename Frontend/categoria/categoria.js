const apiURL = "http://localhost:8000/categoria/"; // mi dirección donde vive la API

// Cuando se envía el formulario, hago que no se recargue la página
document.getElementById("categoriaForm").addEventListener("submit", function (e) {
  e.preventDefault(); // detengo el comportamiento normal del form
  const nombreCategoria = document.getElementById("nombre_categoria").value; // saco el nombre que escribió el usuario

  const nuevaCategoria = { nombre_categoria: nombreCategoria }; // armo el objeto para mandarlo a la API

  fetch(apiURL, {
    method: "POST", // le digo a la API que quiero agregar algo
    headers: {
      "Content-Type": "application/json" // mando los datos como JSON
    },
    body: JSON.stringify(nuevaCategoria) // convierto mi objeto en texto para enviarlo
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear categoría"); // por si falla, lanzo el error
      return res.json(); // si todo bien, lo convierto a JSON
    })
    .then(() => {
      document.getElementById("categoriaForm").reset(); // limpio el formulario
      cargarCategorias(); // actualizo la lista de categorías
    })
    .catch(error => console.error(error)); // muestro el error si algo no funcionó
});

// Esta función carga todas las categorías que ya existen
function cargarCategorias() {
  fetch(apiURL) // pido las categorías a la API
    .then(res => res.json()) // convierto la respuesta en JSON
    .then(categorias => {
      const contenedor = document.getElementById("categorias"); // agarro el contenedor de categorías
      contenedor.innerHTML = ""; // lo limpio antes de meter cosas nuevas
      categorias.forEach(categoria => {
        const div = document.createElement("div"); // creo un div pa' cada categoría
        div.classList.add("categoria"); // le pongo clase para estilos
        div.innerHTML = `
          <strong>${categoria.nombre_categoria}</strong> <!-- nombre en negrita -->
          <div class="acciones">
            <button onclick="editarCategoria(${categoria.id}, '${categoria.nombre_categoria}')">Editar</button> <!-- botón para editar -->
            <button class="delete" onclick="eliminarCategoria(${categoria.id})">Eliminar</button> <!-- botón para eliminar -->
          </div>
        `;
        contenedor.appendChild(div); // lo meto en el HTML
      });
    })
    .catch(error => console.error("Error al cargar categorías:", error)); // por si algo falla
}

// Función para eliminar una categoría
function eliminarCategoria(id) {
  if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return; // confirmo con el usuario antes

  fetch(`${apiURL}${id}`, {
    method: "DELETE" // le digo a la API que quiero borrar algo
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar categoría"); // si falla, aviso
      cargarCategorias(); // actualizo la lista
    })
    .catch(error => console.error(error)); // muestro el error si pasa algo
}

// Función para editar una categoría
function editarCategoria(id, nombreActual) {
  const nuevoNombre = prompt("Editar nombre de categoría:", nombreActual); // pido el nuevo nombre al usuario

  if (nuevoNombre) {
    fetch(`${apiURL}${id}`, {
      method: "PUT", // le digo a la API que quiero modificar algo
      headers: {
        "Content-Type": "application/json" // mando los datos como JSON
      },
      body: JSON.stringify({ nombre_categoria: nuevoNombre }) // mando el nuevo nombre
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar categoría"); // si algo falla, aviso
        return res.json(); // convierto la respuesta
      })
      .then(() => {
        cargarCategorias(); // actualizo la lista con lo editado
      })
      .catch(error => console.error(error)); // por si algo sale mal
  }
}

// Apenas carga la página, se muestran las categorías existentes
cargarCategorias();
