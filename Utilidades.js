// Escribe el mensaje en el <span> indicado (o lo borra si es "").
// Devuelve true si el campo es correcto (mensaje vacío).
function mostrarError(idSpan, mensaje) {
	document.getElementById(idSpan).textContent = mensaje;
	return mensaje === "";
}

// Borra todos los mensajes de error (spans cuyo id empieza por "info_").
function limpiarErrores(formulario) {
	let spans = formulario.getElementsByTagName("span");
	for (let i = 0; i < spans.length; i++) {
		if (spans[i].id.indexOf("info_") === 0) {
			spans[i].textContent = "";
		}
	}
}

// Un texto con solo espacios cuenta como vacío.
function estaVacio(valor) {
	return valor.trim() === "";
}


// Campo obligatorio simple (sugerencia, etc.)
function validarObligatorio(valor) {
	if (estaVacio(valor)) return " Campo obligatorio.";
	return "";
}

// Solo letras (con tildes, ñ y espacios) y un mínimo de letras.
function validarTextoLetras(valor, minimo) {
	valor = valor.trim();
	if (valor === "") return " Campo obligatorio.";
	if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$/.test(valor)) {
		return " Solo se permiten letras.";
	}
	let letras = valor.replace(/ /g, "").length;
	if (letras < minimo) {
		return " Faltan letras: mínimo " + minimo + ".";
	}
	return "";
}

// NIF: 8 números + letra, y la letra debe ser la correcta.
function validarNIF(valor) {
	valor = valor.trim().toUpperCase();
	if (valor === "") return " Campo obligatorio.";
	if (!/^[0-9]{8}[A-Z]$/.test(valor)) {
		return " Formato incorrecto: 8 números y una letra.";
	}
	let letras = "TRWAGMYFPDXBNJZSQVHLCKE";
	let numero = parseInt(valor.substring(0, 8), 10);
	let letraCorrecta = letras.charAt(numero % 23);
	if (valor.charAt(8) !== letraCorrecta) {
		return " Letra incorrecta.";
	}
	return "";
}

// valorNoValido = value de la opción "Selecciona una opción"
function validarSelect(valor, valorNoValido) {
	if (valor === valorNoValido) return " Debes elegir una opción.";
	return "";
}

// Grupo de radiobuttons: debe haber uno marcado.
function validarRadio(nombreGrupo) {
	let radios = document.getElementsByName(nombreGrupo);
	for (let i = 0; i < radios.length; i++) {
		if (radios[i].checked) return "";
	}
	return " Debes marcar una opción.";
}


// Al menos "minimo" casillas marcadas; indica cuántas lleva.
function validarMinimoMarcadas(nombreGrupo, minimo) {
	let casillas = document.getElementsByName(nombreGrupo);
	let marcadas = 0;
	for (let i = 0; i < casillas.length; i++) {
		if (casillas[i].checked) marcadas++;
	}
	if (marcadas < minimo) {
		return " Debes marcar al menos " + minimo + " opciones (llevas " + marcadas + ").";
	}
	return "";
}


function validarFecha(dia, mes, ano) {
	dia = dia.trim();
	mes = mes.trim();
	ano = ano.trim();

	if (dia === "" || mes === "" || ano === "") {
		return " Debes rellenar día, mes y año.";
	}
	// Día y mes de 1 o 2 cifras, año de 4 cifras
	if (!/^[0-9]{1,2}$/.test(dia) || !/^[0-9]{1,2}$/.test(mes) || !/^[0-9]{4}$/.test(ano)) {
		return " Formato incorrecto (el año debe tener 4 cifras).";
	}
	let d = parseInt(dia, 10);
	let m = parseInt(mes, 10);
	let a = parseInt(ano, 10);

	// Los meses en JavaScript van de 0 a 11.
	// Si la fecha no existe, Date la "corrige" (31/02 -> 02/03),
	// así que comprobamos que lo obtenido coincide con lo escrito.
	let fecha = new Date(a, m - 1, d);
	if (fecha.getFullYear() !== a || fecha.getMonth() !== m - 1 || fecha.getDate() !== d) {
		return " La fecha no existe.";
	}
	return "";
}


// Número decimal en metros (coma o punto), entre 0,50 y 2,50.
function validarEstatura(valor) {
	valor = valor.trim();
	if (valor === "") return " Campo obligatorio.";
	valor = valor.replace(",", ".");
	if (!/^[0-9]+(\.[0-9]+)?$/.test(valor)) {
		return " Debe ser un número (ejemplo: 1,75).";
	}
	var numero = parseFloat(valor);
	if (numero < 0.5 || numero > 2.5) {
		return " Fuera de rango: entre 0,50 y 2,50 metros.";
	}
	return "";
}


// Exactamente 20 dígitos, sin espacios ni letras.
function validarCCC(valor) {
	if (valor === "") return " Campo obligatorio.";
	if (!/^[0-9]+$/.test(valor)) {
		return " Solo dígitos, sin espacios ni letras.";
	}
	if (valor.length !== 20) {
		return " Debe tener 20 dígitos (tiene " + valor.length + ").";
	}
	return "";
}

/* ---------- AMPLIACIÓN OPCIONAL: dígitos de control ---------- */
// Formato: EEEE OOOO DD NNNNNNNNNN (entidad, oficina, control, cuenta).
// Se deja sin conectar en las páginas, porque los datos de prueba del
// enunciado ("CCC con 20 dígitos: correcto") no cumplirían el control.
// Para usarla: añadir  || validarDigitosControlCCC(valor)  tras validarCCC.
// Pregunte Ia

function calcularDigitoControl(cadena) {
	let pesos = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
	let suma = 0;
	for (let i = 0; i < 10; i++) {
		suma += parseInt(cadena.charAt(i), 10) * pesos[i];
	}
	let dc = 11 - (suma % 11);
	if (dc === 11) dc = 0;
	if (dc === 10) dc = 1;
	return dc;
}

function validarDigitosControlCCC(valor) {
	let dc1 = calcularDigitoControl("00" + valor.substring(0, 8));
	let dc2 = calcularDigitoControl(valor.substring(10, 20));
	if (valor.substring(8, 10) !== "" + dc1 + dc2) {
		return " Dígitos de control incorrectos.";
	}
	return "";
}
