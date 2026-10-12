"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const TOTAL_EJERCICIOS = 80;
const ARCHIVO_RESULTADOS_ESPERADOS = path.join(__dirname, "resultados-esperados.json");
const carpetaEntregas = path.resolve(process.argv[2] || path.join(__dirname, "ejercicios"));
const timeoutMs = 1000;

function extraerCodigo(html) {
  const scripts = [];
  const etiquetasScript = html.match(/<script\b[^>]*>/gi) || [];

  if (etiquetasScript.some((etiqueta) => /\bsrc\s*=/i.test(etiqueta))) {
    throw new Error("No se admiten scripts externos con atributo src.");
  }

  const expresionScript = /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi;
  for (const coincidencia of html.matchAll(expresionScript)) {
    scripts.push(coincidencia[1]);
  }

  if (scripts.length === 0) {
    throw new Error("No se encontró código JavaScript dentro de una etiqueta <script>.");
  }

  return scripts.join("\n;\n");
}

function ejecutarHtml(ruta) {
  const html = fs.readFileSync(ruta, "utf8");
  const codigo = extraerCodigo(html);
  const salida = [];
  const sandbox = {
    console: {
      log: (...argumentos) => salida.push(argumentos),
    },
  };

  vm.runInNewContext(codigo, sandbox, {
    filename: path.basename(ruta),
    timeout: timeoutMs,
  });

  return salida;
}

function serializar(valor) {
  return JSON.stringify(valor);
}

if (!fs.existsSync(carpetaEntregas) || !fs.statSync(carpetaEntregas).isDirectory()) {
  console.error(`No existe la carpeta de ejercicios: ${carpetaEntregas}`);
  process.exit(2);
}

if (!fs.existsSync(ARCHIVO_RESULTADOS_ESPERADOS)) {
  console.error(`No se encontró el archivo de referencia: ${ARCHIVO_RESULTADOS_ESPERADOS}`);
  process.exit(2);
}

const resultadosEsperados = JSON.parse(
  fs.readFileSync(ARCHIVO_RESULTADOS_ESPERADOS, "utf8")
);
if (!Array.isArray(resultadosEsperados) || resultadosEsperados.length !== TOTAL_EJERCICIOS) {
  console.error(
    `El archivo de referencia debe contener exactamente ${TOTAL_EJERCICIOS} resultados.`
  );
  process.exit(2);
}

let aprobados = 0;
let fallidos = 0;
let ausentes = 0;

for (let numero = 1; numero <= TOTAL_EJERCICIOS; numero += 1) {
  const nombre = `ejercicioregex${numero}.html`;
  const rutaEntrega = path.join(carpetaEntregas, nombre);

  if (!fs.existsSync(rutaEntrega)) {
    console.log(`FALTA  ${nombre}`);
    ausentes += 1;
    continue;
  }

  try {
    const resultadoObtenido = ejecutarHtml(rutaEntrega);
    const resultadoEsperado = resultadosEsperados[numero - 1];

    if (serializar(resultadoObtenido) !== serializar(resultadoEsperado)) {
      console.log(`FALLA  ${nombre}`);
      console.log(`       Esperado: ${serializar(resultadoEsperado)}`);
      console.log(`       Obtenido: ${serializar(resultadoObtenido)}`);
      fallidos += 1;
      continue;
    }

    console.log(`OK     ${nombre}`);
    aprobados += 1;
  } catch (error) {
    console.log(`ERROR  ${nombre}: ${error.message}`);
    fallidos += 1;
  }
}

console.log("");
console.log(
  `Resultado: ${aprobados}/${TOTAL_EJERCICIOS} correctos; ` +
    `${fallidos} incorrectos; ${ausentes} archivos ausentes.`
);

if (fallidos > 0 || ausentes > 0) {
  process.exitCode = 1;
}
