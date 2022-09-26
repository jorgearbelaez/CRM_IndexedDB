(function () {
  let DB;
  let idCliente;
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");
  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    formulario.addEventListener("submit", actualizarCliente);

    // verificar el id de la url
    const parametrosURL = new URLSearchParams(window.location.search);

    const idCliente = parametrosURL.get("id");

    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 1000);
    }
  });
  function conectarDB() {
    const abrirConexion = window.indexedDB.open("crm", 1);

    abrirConexion.onerror = function () {
      console.log("hubo un error");
    };

    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  }

  function actualizarCliente(e) {
    e.preventDefault();

    if (
      nombreInput.value === "" ||
      emailInput.value === "" ||
      empresaInput.value === "" ||
      telefonoInput.value === ""
    ) {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }
    //actualizar el cliente
    const clienteActualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      empresa: empresaInput.value,
      telefono: telefonoInput.value,
      id: Number(idCliente),
    };
    console.log(clienteActualizado);

    const transaction = DB.transaction(["crm"], "readwrite");

    const objectStore = transaction.objectStore("crm");

    objectStore.put(clienteActualizado);

    transaction.oncomplete = function () {
      console.log("Editado correctamente");
    };
    transaction.onerror = function () {
      imprimirAlerta("hubo un error", "error");
    };
  }

  function obtenerCliente(id) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");

    const cliente = objectStore.openCursor();

    cliente.onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          console.log(cursor.value);
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }

  function llenarFormulario(datosCliente) {
    const { nombre, email, telefono, empresa } = datosCliente;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }
})();
