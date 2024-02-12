// Obtener elementos del DOM
const btnComenzar = document.getElementById('btnComenzar');
const formJugadores = document.getElementById('formJugadores');
const btnEmpezar = document.getElementById('btnEmpezar');
const jugadoresSection = document.getElementById('play');
const inputJugadores = document.querySelectorAll('.player-names input');
const btnJugarBingo = document.querySelector('.button-jugar');
const numeroRandom = document.querySelector('.random');
const contadorTurno = document.querySelector('.turnos');
const cartones = {}; 
let turnoActual = 0; 
let jugadorActual = null; 
let numerosSeleccionados = []; 

btnEmpezar.addEventListener('click', function() {

  formJugadores.classList.add('hidden');
  jugadoresSection.classList.remove('hidden');
  document.querySelector('.numeros').classList.remove('hidden');
});

// Función para desplegar y ocultar el formulario de jugadores
function alternarFormulario() {
  if (formJugadores.classList.contains('hidden')) {
    formJugadores.classList.remove('hidden');
    btnComenzar.textContent = 'VOLVER';
  } else {
    formJugadores.classList.add('hidden');
    btnComenzar.textContent = 'QUIERO JUGAR BINGO!';
  }
}

// Evento click para el botón de "QUIERO JUGAR BINGO!"
btnComenzar.addEventListener('click', alternarFormulario);

function mostrarTablero(idCarton) {
  Object.values(cartones).forEach(carton => {
    carton.classList.add('hidden');
  });
  cartones[idCarton].classList.remove('hidden');
}

// Función para generar un tablero de bingo para un jugador específico
function generarTableroParaJugador(jugador) {
  const boardSize = parseInt(document.getElementById('boardSize').value);
  const carton = document.getElementById(`carton${jugador}`);
  carton.innerHTML = '';


  const numerosUnicos = new Set();
  while (numerosUnicos.size < boardSize * boardSize) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    numerosUnicos.add(randomNumber);
  }
  const numerosArray = Array.from(numerosUnicos);

  // Generar el tablero de bingo
  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const randomNumberIndex = Math.floor(Math.random() * numerosArray.length);
      const randomNumber = numerosArray.splice(randomNumberIndex, 1)[0];
      cell.textContent = randomNumber;
      row.appendChild(cell);
    }
    carton.appendChild(row);
  }
}

// Evento click para los botones de los jugadores
document.querySelectorAll('.btn-jugador').forEach(btn => {
  const jugador = parseInt(btn.id.slice(-1));
  const cartonJugador = document.getElementById(`carton${jugador}`);
  cartones[`carton${jugador}`] = cartonJugador; 
  btn.addEventListener('click', function() {
    // Si se selecciona un nuevo jugador, ocultar el tablero actual
    if (jugadorActual !== jugador) {
      if (jugadorActual !== null) {
        cartones[`carton${jugadorActual}`].classList.add('hidden');
      }
      jugadorActual = jugador; 
    }
    mostrarTablero(`carton${jugador}`);
    if (!cartones[`carton${jugador}`].innerHTML) {
      generarTableroParaJugador(jugador);
    }
  });
});

// Asignar nombres a los botones de los jugadores
inputJugadores.forEach((input, index) => {
  input.addEventListener('input', function() {
    const nombre = this.value.trim();
    const btnJugador = document.getElementById(`btnJugador${index + 1}`);
    btnJugador.textContent = nombre;
    btnJugador.classList.remove('hidden');
  });
});

// Agregar un event listener al botón "JUGAR BINGO"
btnJugarBingo.addEventListener('click', function() {
  const numeroAleatorio = Math.floor(Math.random() * 50) + 1;
  numeroRandom.textContent = `B I N G O: ${numeroAleatorio}`;
  turnoActual++; // Incrementar el contador de turnos
  contadorTurno.textContent = `TURNO: ${turnoActual}`;
  
  // Verificar si el número aleatorio ya fue seleccionado
  if (!numerosSeleccionados.includes(numeroAleatorio)) {
    numerosSeleccionados.push(numeroAleatorio);
    Object.values(cartones).forEach(carton => {
      Array.from(carton.querySelectorAll('.cell')).forEach(cell => {
        if (parseInt(cell.textContent) === numeroAleatorio) {
          cell.classList.add('selected');
        }
      });
    });
  }
  
  if (turnoActual === 25) {
    alert('¡Fin del juego!');
    btnJugarBingo.classList.add('hidden');
    document.querySelector('.random').classList.add('hidden');
    document.querySelector('.turnos').classList.add('hidden');
    document.querySelectorAll('.btn-jugador').forEach(btn => {
        btn.classList.add('hidden');
      });
    //cerrarJuego();
  }
});

// lastimosamente esto no funciona
// Función para cerrar el juego al finalizar los turnos
function cerrarJuego() {
  jugadoresSection.classList.add('hidden');
  document.querySelector('.numeros').classList.add('hidden');
  document.querySelector('.turnos').classList.add('hidden');

  // Calcular puntajes y mostrarlos
  calcularPuntajes();
}
// Función para calcular los puntajes de los jugadores
function calcularPuntajes() {
  for (let i = 1; i <= 4; i++) {
    const tablero = document.getElementById(`carton${i}`);
    const puntaje = calcularPuntajes(tablero);
    const puntajeElement = document.getElementById(`puntajeJugador${i}`);
    puntajeElement.textContent = `Jugador ${i}: ${puntaje} puntos`;
  }

  // Determinar el ganador
  let maxPuntaje = 0;
  let ganador = 0;
  for (let i = 1; i <= 4; i++) {
    const puntajeElement = document.getElementById(`puntajeJugador${i}`);
    const puntaje = parseInt(puntajeElement.textContent.split(":")[1].trim());
    if (puntaje > maxPuntaje) {
      maxPuntaje = puntaje;
      ganador = i;
    }
  }
  // Mostrar la sección de puntajes
  const puntajesSection = document.getElementById('puntajes');
  puntajesSection.classList.remove('hidden');
}
