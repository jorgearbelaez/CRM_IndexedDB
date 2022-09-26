(function () {
  let DB;
  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    formulario.addEventListener("submit", validarCliente);
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

  function validarCliente(e) {
    e.preventDefault();

    // leer los inputs

    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    //crear un objeto con la informacion

    // object literal enhacement

    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
    };
    (cliente.id = Date.now()), // agregamos id
      crearNuevoCliente(cliente);
  }
  function crearNuevoCliente(cliente) {
    // usamos la instancia creada de nuestra conexion (DB)

    const transaction = DB.transaction(["crm"], "readwrite");

    //definimos el objectStore
    const objectStore = transaction.objectStore("crm");

    objectStore.add(cliente);

    transaction.onerror = function () {
      imprimirAlerta("hubo un error", "error");
    };

    transaction.oncomplete = function () {
      imprimirAlerta("El cliente se agrego correctamente");

      // una vez que me agregue el cliente me mande al index automaticamente
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    };
  }
})();
