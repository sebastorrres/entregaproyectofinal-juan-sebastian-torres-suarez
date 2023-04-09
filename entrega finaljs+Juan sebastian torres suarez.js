// Obtener referencias a elementos del DOM
var notasForm = document.getElementById("notas-form");
const notasTable = document.getElementById("notas-table");
const resetBtn = document.getElementById("reset-btn");

// Obtener las notas del almacenamiento local si existen, de lo contrario, crear un arreglo vacío
const notasStorage = localStorage.getItem('notas');
const notas = notasStorage ? JSON.parse(notasStorage) : [];

// Función para guardar las notas en el almacenamiento local
function guardarNotas() {
    localStorage.setItem('notas', JSON.stringify(notas));
}

function actualizarTabla() {
    return new Promise((resolve, reject) => {
      notasTable.innerHTML = "";
  
      // Si no hay notas, mostrar un mensaje en la tabla
      if (notas.length === 0) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td colspan="7">No hay notas guardadas</td>
        `;
        notasTable.appendChild(newRow);
        resolve();
      }
  
      notas.forEach(({ nombre, nota1, nota2, nota3, nota4, nota5, promedio }) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${nombre}</td>
          <td>${nota1}</td>
          <td>${nota2}</td>
          <td>${nota3}</td>
          <td>${nota4}</td>
          <td>${nota5}</td>
          <td>${promedio.toFixed(2)}</td>
        `;
        notasTable.appendChild(newRow);
      });
  
      resolve();
    });
  }
 
// Actualizar la tabla de notas al cargar la página
actualizarTabla();

// Agregar un evento para guardar las notas cuando se envíe el formulario
notasForm.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const nombre = document.getElementById("nombre").value;
    const nota1 = parseInt(document.getElementById("nota1").value);
    const nota2 = parseInt(document.getElementById("nota2").value);
    const nota3 = parseInt(document.getElementById("nota3").value);
    const nota4 = parseInt(document.getElementById("nota4").value);
    const nota5 = parseInt(document.getElementById("nota5").value);
  
    // Validar que se ingresaron notas válidas (números entre 0 y 10)
    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3) || isNaN(nota4) || isNaN(nota5) ||
        nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10 || nota3 < 0 || nota3 > 10 || nota4 < 0 || nota4 > 10 || nota5 < 0 || nota5 > 10) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingrese notas válidas (números entre 0 y 10)',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
  
    const promedio = (nota1 + nota2 + nota3 + nota4 + nota5) / 5;
  
    notas.push({ nombre, nota1, nota2, nota3, nota4, nota5, promedio });
  
    guardarNotas();
    actualizarTabla();
    notasForm.reset();
    Swal.fire({
      title: 'Notas guardadas',
      text: 'Las notas han sido guardadas correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    // Agregar código para enviar los datos del formulario a un servidor utilizando fetch
    const formData = new FormData(notasForm);
    fetch('/guardar-nota', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar las notas');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  });
   // Agregar un evento de clic al botón de reiniciar notas
resetBtn.addEventListener("click", () => {
    localStorage.removeItem('notas');
    notas.length = 0;
    actualizarTabla();
    Swal.fire({
      title: 'Notas reiniciadas',
      text: 'Todas las notas han sido eliminadas correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  });