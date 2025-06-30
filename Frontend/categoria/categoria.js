const apiURL = "http://localhost:8000/categoria/";

document.getElementById("categoriaForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombreCategoria = document.getElementById("nombre_categoria").value;

  const nuevaCategoria = { nombre_categoria: nombreCategoria };

  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaCategoria)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear categoría");
      return res.json();
    })
    .then(() => {
      document.getElementById("categoriaForm").reset();
      cargarCategorias();
    })
    .catch(error => console.error(error));
});

function cargarCategorias() {
  fetch(apiURL)
    .then(res => res.json())
    .then(categorias => {
      const contenedor = document.getElementById("categorias");
      contenedor.innerHTML = "";
      categorias.forEach(categoria => {
        const div = document.createElement("div");
        div.classList.add("categoria");
        div.innerHTML = `
          <strong>${categoria.nombre_categoria}</strong>
          <div class="acciones">
            <button onclick="editarCategoria(${categoria.id}, '${categoria.nombre_categoria}')">Editar</button>
            <button class="delete" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => console.error("Error al cargar categorías:", error));
}

function eliminarCategoria(id) {
  if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

  fetch(`${apiURL}${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar categoría");
      cargarCategorias();
    })
    .catch(error => console.error(error));
}

function editarCategoria(id, nombreActual) {
  const nuevoNombre = prompt("Editar nombre de categoría:", nombreActual);

  if (nuevoNombre) {
    fetch(`${apiURL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre_categoria: nuevoNombre })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al editar categoría");
        return res.json();
      })
      .then(() => {
        cargarCategorias();
      })
      .catch(error => console.error(error));
  }
}

// Mostrar las categorías al cargar la página
cargarCategorias();