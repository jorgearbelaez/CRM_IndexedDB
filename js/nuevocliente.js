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

  function imprimirAlerta(mensaje, tipo) {
    const alerta = document.querySelector(".alerta");
    if (!alerta) {
      //crear alerta

      const divMensaje = document.createElement("div");
      divMensaje.classList.add(
        "px-4",
        "py-3",
        "rounded",
        "max-w-lg",
        "mx-auto",
        "mt-6",
        "text-center"
      );

      if (tipo === "error") {
        divMensaje.classList.add(
          "bg-red-100",
          "border-red-400",
          "text-red-700",
          "border",
          "alerta"
        );
      } else {
        divMensaje.classList.add(
          "bg-green-100",
          "border-green-400",
          "text-green-700"
        );
      }

      divMensaje.textContent = mensaje;

      formulario.appendChild(divMensaje);

      setTimeout(() => {
        divMensaje.remove();
      }, 5000);
    }
  }
})();
