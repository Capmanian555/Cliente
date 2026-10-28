// =====================================================================
// EJERCICIO 1.4 · Semáforo con callbacks
// Abre semaforo.html en el navegador para ver el resultado.
//
// 1. Crea cambiarColor(color, ms, callback), que:
//      - pinte el fondo del círculo con ese color
//        (semaforo.style.background = color)
//      - y llame a callback pasados ms milisegundos (usa setTimeout)
//
// 2. Úsala para que el semáforo pase de:
//      verde ('green') 3 s  →  ámbar ('orange') 1 s  →  rojo ('red') 3 s
//    y vuelva a empezar.
//
// 3. Fíjate en la forma que toma tu código.
//    ¿Cómo quedaría con diez colores?
// =====================================================================

const semaforo = document.getElementById('semaforo');

// Tu código aquí:
const cambiarColor = (color, ms, callback) => {
  semaforo.style.background = color;
  setTimeout(callback, ms);
};

const ciclo = () => {
  cambiarColor('green', 3000, () => {
    cambiarColor('orange', 1000, () => {
      cambiarColor('red', 3000, ciclo);
    });
  });
};

ciclo();

// Forma del código: cada color nuevo se anida un nivel más dentro del
// callback anterior, y el código crece hacia la derecha en forma de
// pirámide. Con diez colores serían diez niveles de anidación, difícil de
// leer y de modificar (el famoso "callback hell").

