//? variables and selectors
const form = document.querySelector("#agregar-gasto");
const listedExpense = document.querySelector("#gastos ul");

//? Events

eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", askForExpense);
  form.addEventListener("submit", addExpense);
}

//? Las Clases Inician Con Mayuscula
class Budget {
  constructor(budget) {
    //? con el number se puede convertir a numero
    this.budget = Number(budget);
    this.remaining = Number(budget);
    this.gastos = [];
  }

  newGasto(gasto) {
    // console.log(gasto);
    this.gastos = [...this.gastos, gasto];
    // console.log(this.expense);
    this.calculateRemaining();
  }

  calculateRemaining() {
    const wornOut = this.gastos.reduce(
      (total, gasto) => total + gasto.quantity,
      0
    );
    // console.log(wornOut);
    this.remaining = this.budget - wornOut;
    // console.log(this.remaining);
  }

  deleteGasto(id) {
    // console.log("desde la clase");
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    // console.log(this.gastos);
    this.calculateRemaining();
  }
}

class UI {
  insertBudget(quantity) {
    // console.log(quantity);
    //? Extraer el valor
    const { budget, remaining } = quantity;

    //? Agregar al HTML
    document.querySelector("#total").textContent = budget;
    document.querySelector("#restante").textContent = remaining;
  }

  printAlert(message, guy) {
    //? create el div
    const divMessage = document.createElement("div");
    divMessage.classList.add("text-center", "alert");

    if (guy === "error") {
      divMessage.classList.add("alert-danger");
    } else {
      divMessage.classList.add("alert-success");
    }

    //? Mensaje de error
    divMessage.textContent = message;

    //? Insertar en el HTML
    document.querySelector(".primario").insertBefore(divMessage, form);

    //? Quitar del HTML
    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }

  showGastos(gastos) {
    this.cleanHTML(); //? Elimina el HTML previo

    // console.log(expense);
    //? Iterar sobre los gastos
    gastos.forEach((gasto) => {
      // console.log(expense);
      const { quantity, name, id } = gasto; //? destructuring

      //? Crear un LI
      const newGasto = document.createElement("li");
      newGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // newGasto.setAttribute("data-id", id); //? Forma anterior de agregar un atributo
      newGasto.dataset.id = id; //? Forma nueva de agregar un atributo
      // console.log(newGasto);

      //? Agregar el HTML el Gasto
      newGasto.innerHTML = `${name} <span class="badge badge-primary badge-pill">$ ${quantity}</span>`;

      //? Boton para borrar el gasto
      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn", "btn-danger", "borrar-gasto");
      btnDelete.innerHTML = "Borrar &times";
      btnDelete.onclick = () => {
        deleteGasto(id);
      };
      newGasto.appendChild(btnDelete);

      //? Agregar el gasto al HTML
      listedExpense.appendChild(newGasto);
    });
  }
  cleanHTML() {
    while (listedExpense.firstChild) {
      listedExpense.removeChild(listedExpense.firstChild);
    }
  }
  updateRemaining(remaining) {
    document.querySelector("#restante").textContent = remaining;
  }

  checkBudget(budgetObj) {
    const { budget, remaining } = budgetObj;

    const restanteDiv = document.querySelector(".restante");

    //? Comprobar 25%
    if (budget / 4 > remaining) {
      // console.log("Presupuesto al 25%");
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (budget / 2 > remaining) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //? Si el total es 0 o menor
    if (remaining <= 0) {
      ui.printAlert("El Presupuesto Se Ha Agotado", "error");
      form.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//? Instanciar la clase UI
const ui = new UI();
let budget;

//? Functions

function askForExpense() {
  const budgetUse = prompt("¿Cual es tu presupuesto semanal?");

  //   console.log(budgetUse);

  if (
    budgetUse === "" ||
    budgetUse === null ||
    isNaN(budgetUse) ||
    budgetUse <= 0
  ) {
    window.location.reload();
  }

  //? valid quote
  budget = new Budget(budgetUse);
  console.log(budget);

  ui.insertBudget(budget);
}

//?  Add Expense como es sumit le pasamos e
function addExpense(e) {
  e.preventDefault();

  //? Leer los datos del formulario
  const name = document.querySelector("#gasto").value;
  const quantity = Number(document.querySelector("#cantidad").value);

  //? validate
  if (name === "" || quantity === "") {
    ui.printAlert("Ambos Campos Son Obligatorios", "error");
    return;
  } else if (quantity <= 0 || isNaN(quantity)) {
    ui.printAlert("Cantidad no válida", "error");
    return;
  }
  // console.log("Agregando Gasto");

  //? Generar un objeto con el gasto
  //   const { name, quantity } = gasto; //? destructuring que extrae el nombre y la cantidad a gasto
  //? mientras esta une el nombre y la cantidad a gasto conocido como object literal👇
  const gasto = { name, quantity, id: Date.now() };
  // console.log(gasto);

  //? Añade un nuevo gasto
  budget.newGasto(gasto);

  //? Mensaje de todo bien!
  ui.printAlert("Gasto Agregado Correctamente", "alert-success");

  //? Imprimir los gastos
  const { gastos, remaining } = budget; //? destructuring
  ui.showGastos(gastos);

  ui.updateRemaining(remaining);

  ui.checkBudget(budget);

  //? Reinicia el formulario
  form.reset();
}

function deleteGasto(id) {
  //   console.log(id);

  //! Elimina del Objeto
  budget.deleteGasto(id);

  //! Elimina los gastos del HTML
  const { gastos, remaining } = budget;
  ui.showGastos(gastos);
  ui.updateRemaining(remaining);
  ui.checkBudget(budget);
}
