//Promesas

//Fabricar la promesa
// function pedirPizza(tipo) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {                          //la pizza tarda 2 segundos
//             if (tipo === 'piña') {
//                 reject (new Error('Aquí no hacemos pizza con piña'))  //ha ido mal
//             } else {
//                 resolve ('Pizza ' + tipo)    // ha ido bien
//             }
//         }, 2000);
//     }
// )
// }

// //Usar la promesa

// pedirPizza('piña')
// .then(pizza => console.log('Ha llegado:', pizza))
// .catch(error => console.log('Problema:', error.message))
// .finally(() => console.log('Fin del pedido'));


const lanzarDado = () => new Promise((resolve, reject) => {
    setTimeout (() => {
        const n = Math.ceil(Math.random() * 6)   // número del 1 al 6
        if (n === 1) reject (new Error('Has sacado un 1'))
        else resolve(n)
    }, 1000)
})

lanzarDado()
    .then(n => console.log('Salió un', n))
    .catch(err => console.log('Error:', err.message))
    .finally(()=> console.log('Fin de la tirada'))

//plantilla promesas

function nombre(datos) {
    return new Promise((resolve, reject) => {
        // lógica que hace el trabajo
        // si ha ido bien resolve(resultado)
        // si ha ido mal reject(new Error('...'))
    })
}

