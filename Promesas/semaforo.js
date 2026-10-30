// =====================================================================
// EJERCICIO 2.6 · Adiós, pirámide: el semáforo con promesas
// Abre semaforo.html en el navegador para ver el resultado.
//
// Rehaz el semáforo del ejercicio 1.4 (verde 3 s → ámbar 1 s → rojo 3 s,
// y vuelta a empezar), pero ahora con promesas:
//
// 1. Copia aquí tu función esperar(ms) del ejercicio 2.5.
// 2. Crea color(c, ms), que pinte el círculo con el color c
//    y DEVUELVA esperar(ms).
// 3. Encadena los tres colores con then, sin meter un then dentro de otro.
//
// Compara la forma del código con la de tu versión del ejercicio 1.4.
// =====================================================================

const semaforo = document.getElementById('semaforo');

// Tu código aquí:
// En esta funcion es una promesa que simple se cumple ya que nunca falla, ya que recibe los milisegundos que quieres que espere la funcion.

function esperar(ms){
  return new Promise(resolve => {
    setTimeout(() => resolve() , ms);
  });
}

// Esta funcion recibe un color(c) y unos milisegundos(ms),la cual cambia el color segun el color pasado, y llama a esperar(ms)para saber cuantos milisegundos esperar para el siguiente cambio de color.
function color(c, ms) {
  semaforo.style.backgroundColor = c;
  return esperar(ms);
}

// Esta funcion llama a la funcion color() varias veces para que el color vaya cambiando segun las variables puestas(c y ms).Al final se llama a si misma para que la funcion sea un bucle infinito.
function ciclo() {
  color('green', 3000)
    .then(() => color('orange', 1000))
    .then(() => color('red', 3000))
    .then(() => ciclo());
}

ciclo();