window.onload = function () {
    // Acciones tras cargar la página
    pantalla1 = document.getElementById("pantalla1"); // elemento pantalla 1 de salida
    pantalla2 = document.getElementById("pantalla2"); // elemento pantalla 2 de salida
    memoriaOn = document.getElementById("memoriaOn"); // capturamos memoriaOn
    control = document.getElementById("control"); // capturamos control
    document.onkeypress = capturarTecla;
};

var decimales = 8; // longitud máxima de decimales
var lonMax = 20; // longitud máxima de caracteres a introducir

var coma = false; // control de introducción de coma
var operacion = ""; // última operación introducida
var nuevaOperacion = false; // control de nueva operación
var numEnProceso = ""; // último número en proceso para trabajar con él
var simboloTemp = false; // control del símbolo a la hora de buscar último operador
var resultadoEnProceso = ""; // resultado temporal para mostrar
var numTemp = 0; // variable temporal para sacar el factorial
var numMemoria = ""; // número almacenado en memoria
var pantalla1Temp = ""; // variable para capturar la pantalla1 de forma temporal
var eopi = false; // controlador de repetición de número e o pi

var tipoUltimoCaracter = ""; // variable para indicar el tipo del último carácter
var ultCaracter = ""; // variable para indicar el último carácter
var penultimo = ""; // variable para indicar el penúltimo carácter

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCION CAPTURAR TECLA                                            │
// │  Se utiliza para capturar la tecla presionada                      │
// └────────────────────────────────────────────────────────────────────┘
function capturarTecla(evObject) {
    var elCaracter = String.fromCharCode(evObject.which);
    if (evObject.which != 0 && evObject.which != 13) {
        // si teclea un número, llamamos a la función número
        if ((elCaracter >= 0 && elCaracter <= 9) || elCaracter == ".") {
            numero(elCaracter);
        }
    }
    // si teclea un operador, llama a la función operador
    switch (evObject.keyCode) {
        case 43:
            operar("+");
            break;
        case 45:
            operar("-");
            break;
        case 42:
            operar("*");
            break;
        case 47:
            operar("/");
            break;
        case 13: // enter
            igual();
            break;
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN NUMERO                                                    │
// │  Se utiliza para gestionar la introducción de un número            │
// └────────────────────────────────────────────────────────────────────┘
function numero(num) {
    // controlamos si es una nueva operación para reiniciar pantalla1
    if (nuevaOperacion) {
        pantalla1.innerHTML = "0";
        nuevaOperacion = false;
    }
    // controlamos si hay cero inicial en pantalla 1 para borrarlo
    if (pantalla1.innerHTML == "0" && num != ".") {
        // si hay cero inicial y lo que se ha pulsado no es un punto, borramos el cero
        pantalla1.innerHTML = "";
    }

    if (pantalla1.innerHTML.length < lonMax) {
        // si no supera la longitud máxima, añadimos num

        // controlamos que no se repita la coma
        if (num == "." && coma == false) {
            // controlamos si ha introducido la coma justo tras un operador para añadir un cero al final de pantalla1, antes del punto
            ultimoCaracter();
            if (tipoUltimoCaracter == "operador") {
                pantalla1.innerHTML += "0";
            }
            pantalla1.innerHTML += num;
            coma = true;
        }

        if (num != ".") {
            // si se ha pulsado un número, lo añadimos a pantalla
            pantalla1.innerHTML += num;
        }
        resultadoTemporal(); // mostramos el resultado temporal en pantalla2
    } else {
        alert("Alerta, máximo de caracteres alcanzado (" + lonMax + ")");
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN RESULTADO TEMPORAL                                        │
// │  Muestra de forma inmediata el resultado de la operación en        │
// │  pantalla2                                                         │
// └────────────────────────────────────────────────────────────────────┘
function resultadoTemporal() {
    // mostramos en pantalla2 el resultado de la operación completa de pantalla1
    pantalla2.innerHTML = parseFloat(
        eval(pantalla1.innerHTML).toFixed(decimales)
    );

    // pruebas de evaluación de fórmulas
    //pantalla2.innerHTML = parseFloat(eval("20%-3").toFixed(decimales));

    ultimoCaracter();
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN OPERAR                                                    │
// │  Gestión de introducción de carácter operador en pantalla1         │
// └────────────────────────────────────────────────────────────────────┘
function operar(op) {
    // comprobamos el último carácter por si es un operador
    ultimoCaracter();

    // si el último dígito es un operador para cambiarlo por el nuevo operador
    if (tipoUltimoCaracter == "operador") {
        // eliminamos el último carácter
        pantalla1.innerHTML = pantalla1.innerHTML.slice(0, -1);
        pantalla1.innerHTML += op; // añadimos el operador
    } else {
        pantalla1.innerHTML += op; // si no hay operador anterior, únicamente añadimos el nuevo operador
    }
    ultimoCaracter();
    coma = false; // podemos introducir nueva coma decimal
    nuevaOperacion = false; // indicamos que continuamos con el operador en pantalla1
    eopi = false;
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN IGUAL                                                     │
// │  Resultado de la operación que hay en pantalla1 y reinicio de      │
// │  variables por si quiere seguir operando                           │
// └────────────────────────────────────────────────────────────────────┘
function igual() {
    pantalla1.innerHTML = pantalla2.innerHTML; // pasamos a pantalla1 el resultado temporal de pantalla2
    //pantalla2.innerHTML = "0"; // reiniciamos pantalla2
    coma = false; // reiniciamos coma
    nuevaOperacion = true; // reiniciamos operación
    cl("Igual");
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  NUMERO FACTORIAL                                                  │
// │  Para sacar el factorial del último número introducido             │
// └────────────────────────────────────────────────────────────────────┘
function factorial() {
    // localizamos el número al que hay que hacer el factorial
    numeroEnProceso();

    // si empieza por - o si es negativo, error al factorizar
    if (ultCaracter == "-" || numEnProceso < 0) {
        pantalla1.innerHTML = "Factorizando negativo";
        pantalla2.innerHTML = "Error";
        // reiniciamos variables para nueva operación
        nuevaOperacion = true;
        coma = false;
        operacion = "";
        numEnProceso = "";
        numMemoria = "";
        resultadoEnProceso = "";
    } else {
        // reiniciamos numTemp
        numTemp = 1;

        //hacemos el cálculo
        for (i = 1; i <= numEnProceso; i++) {
            numTemp *= i;
        }

        pantalla1.innerHTML += numTemp; // añadimos en pantalla el factorial
        limpiaCero(); // limpiamos si hubiera cero inicial
        resultadoTemporal(); // mostramos el resultado temporal en pantalla2
        nuevaOperacion = true; // indicamos que hacemos una nueva operación
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN RAIZ                                                      │
// │  Para sacar la raíz cuadrada del último número introducido         │
// └────────────────────────────────────────────────────────────────────┘
function raiz() {
    // localizamos el número al que hay que hacer la raíz
    numeroEnProceso();
    // añadimos en pantalla la raíz del número
    pantalla1.innerHTML += parseFloat(
        Math.sqrt(numEnProceso).toFixed(decimales)
    );

    limpiaCero(); // limpiamos si hubiera cero inicial
    resultadoTemporal(); // mostramos el resultado temporal en pantalla2
    nuevaOperacion = true; // indicamos que hacemos una nueva operación
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN PORCIENTO                                                 │
// │  Para sacar el tanto por ciento del último número introducido      │
// └────────────────────────────────────────────────────────────────────┘
function porCiento() {
    // localizamos el número al que hay que hacer el porciento %
    numeroEnProceso();
    // añadimos a pantalla el número porciento
    pantalla1.innerHTML += (numEnProceso / 100).toFixed(decimales);
    limpiaCero(); // limpiamos si hubiera cero inicial
    resultadoTemporal(); // mostramos el resultado temporal en pantalla2
    nuevaOperacion = true; // indicamos que hacemos una nueva operación
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN OPUESTO                                                   │
// │  Para cambiar el signo del último número introducido (+/-)         │
// └────────────────────────────────────────────────────────────────────┘
function opuesto() {
    // guardamos el último número introducido
    numeroEnProceso();

    // si el último carácter es - y el penúltimo también, los sustituimos por +
    if (ultCaracter == "-" && penultimo == "-") {
        pantalla1.innerHTML =
            pantalla1.innerHTML.slice(0, -2) + "+" + numEnProceso;
    } else {
        // comprobamos el carácter antes del operador
        switch (ultCaracter) {
            case "+":
                // borramos "+" y lo sustituimos por "-"
                pantalla1.innerHTML =
                    pantalla1.innerHTML.slice(0, -1) + "-" + numEnProceso;
                break;
            case "-":
                // borramos "-" y lo sustituimos por "+"
                pantalla1.innerHTML =
                    pantalla1.innerHTML.slice(0, -1) + "+" + numEnProceso;
                break;
            case "*":
            case "/":
            case "%":
                // con operadores "*,/ y %", le añadimos detrás el signo "-"
                pantalla1.innerHTML = pantalla1.innerHTML + "-" + numEnProceso;
                break;
            default:
                // aquí entra cuando únicamente hay un número en pantalla
                pantalla1.innerHTML = numEnProceso;
                if (pantalla1.innerHTML.substr(0, 1) != "-") {
                    // si no es negativo, lo ponemos
                    pantalla1.innerHTML = "-" + pantalla1.innerHTML;
                } else {
                    // si es negativo, lo eliminamos
                    pantalla1.innerHTML = pantalla1.innerHTML.slice(1);
                }
                break;
        }
    }
    limpiaCero();
    resultadoTemporal();
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN RETROCESO                                                 │
// │  Para borrar el último carácter que hay en pantalla1               │
// └────────────────────────────────────────────────────────────────────┘
function retroceso() {
    // comprobamos la longitud de la cadena de pantalla1 y borramos el último carácter
    if (pantalla1.innerHTML.length > 0) {
        pantalla1.innerHTML = pantalla1.innerHTML.slice(0, -1);
    }

    // si no hay caracteres en pantalla1, pintamos un 0
    if (pantalla1.innerHTML.length == 0) {
        pantalla1.innerHTML = "0";
    }

    // si el último carácter de pantalla1 no es un operador, mostramos el resultadoTemporal en pantalla2
    // (si es un operador, aparece error en la consola)
    ultimoCaracter();
    if (tipoUltimoCaracter == "numero" || tipoUltimoCaracter == "punto") {
        resultadoTemporal();
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN BORRADOPARCIAL                                            │
// │  Para borrar el último número introducido                          │
// └────────────────────────────────────────────────────────────────────┘
function borradoParcial() {
    // localizamos el último número que hay que borrar y lo eliminamos
    numeroEnProceso();
    // reiniciamos variables
    coma = false;
    operacion = "";
    eopi = false;
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN BORRADO TOTAL                                             │
// │  Para borrar toda la operación, memoria y reiniciar la calculadora │
// └────────────────────────────────────────────────────────────────────┘
function borradoTotal() {
    // realizamos borrado parcial
    borradoParcial();
    // reiniciamos todas las variables, vaciando también la memoria
    pantalla1.innerHTML = "0";
    pantalla2.innerHTML = "0";
    numMemoria = 0;
    memoriaOn.innerHTML = "";
    resultadoEnProceso = "";
    numEnProceso = "";
    nuevaOperacion = true;
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN MEMORIA                                                   │
// │  Para almacenar en memoria el resultado temporal                   │
// └────────────────────────────────────────────────────────────────────┘
function memoria() {
    // sumamos el resultado temporal a numMemoria
    numMemoria = parseFloat(pantalla2.innerHTML).toFixed(decimales);

    // limpiamos cero inicial de numMemoria
    if (numMemoria.substring(0, 1) == "0") {
        if (numMemoria.substring(1, 2) != ".") numMemoria = numMemoria.slice(1);
    }

    // mostramos en pantalla símbolo de dato en memoria con su contenido
    memoriaOn.innerHTML = "Mem:(" + parseFloat(numMemoria) + ")";
    pantalla1.innerHTML = 0; // vaciamos el contenido de pantalla1
    coma = false;
    resultadoTemporal(); // mostramos resultado temporal
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN MEMORIA RECUPERAR                                         │
// │  Se utiliza para recuperar el contenido de la memoria y mostrarlo  │
// │  en pantalla1                                                      │
// └────────────────────────────────────────────────────────────────────┘
function memoriaR() {
    // añadimos la memoria a pantalla1
    if (numMemoria != "") {
        // comprobamos si el último dígito de pantalla1 es operador
        ultimoCaracter();
        if (tipoUltimoCaracter == "operador") {
            pantalla1.innerHTML += parseFloat(numMemoria); // añadimos la memoria a la numMemoria
        }

        // si es número, lo multiplicamos por numMemoria
        if (tipoUltimoCaracter == "numero") {
            // si el último carácter es cero y en pantalla2 no hay un cero (para incluir números finalizados en cero), lo sustituimos por la memoria
            if (ultCaracter == "0" && pantalla1.innerHTML == "0") {
                alert("todo cero");
                pantalla1.innerHTML = parseFloat(numMemoria);
            } else {
                pantalla1.innerHTML += "*" + parseFloat(numMemoria); // sustituimos pantalla1 por numMemoria
            }
        }
        limpiaCero(); // limpiamos cero inicial
        resultadoTemporal(); // mostramos resultado temporal
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN NUMESPECIAL                                               │
// │  Se utiliza para sacar el último número introducido en la cadena   │
// │  de la pantalla1, quitarlo de la cadena y almacenarlo en           │
// │  numEspecial                                                       │
// └────────────────────────────────────────────────────────────────────┘
function numeroEspecial(num) {
    if (!eopi) {
        eopi = true;
        switch (num) {
            case "pi":
                numEspecial = Math.PI.toFixed(decimales);
                break;
            case "numeroE":
                numEspecial = Math.E.toFixed(decimales);
                break;
        }
    }

    // localizamos el número que hay que multiplicar por numEspecial
    numeroEnProceso();
    // si numEnProceso es cero, lo ponemos 1 para multiplicar por numEspecial
    if (numEnProceso == "0") {
        numEnProceso = "1";
    }

    pantalla1.innerHTML += parseFloat(numEnProceso * numEspecial).toFixed(
        decimales
    );
    coma = true;
    eopi = true;
    limpiaCero(); // limpiamos cero inicial
    resultadoTemporal(); // mostramos resultado temporal
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN ELEVADO                                                   │
// │  Se utiliza para elevar un número al cuadrado                      │
// └────────────────────────────────────────────────────────────────────┘
function elevado() {
    // localizamos el número al que hay que hacer el cuadrado
    numeroEnProceso();
    // añadimos en pantalla el cuadrado del número indicado
    pantalla1.innerHTML += parseFloat(
        Math.pow(numEnProceso, 2).toFixed(decimales)
    );
    limpiaCero(); // limpiamos cero inicial
    resultadoTemporal(); // mostramos resultado temporal
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN INVERSO                                                   │
// │  Se utiliza para sacar el inverso 1/x de un número                 │
// └────────────────────────────────────────────────────────────────────┘
function inverso() {
    // localizamos el número al que hay que hacer el inverso
    numeroEnProceso();
    // añadimos en pantalla la raíz del número
    pantalla1.innerHTML += parseFloat((1 / numEnProceso).toFixed(decimales));

    limpiaCero(); // limpiamos si hubiera cero inicial
    resultadoTemporal(); // mostramos el resultado temporal en pantalla2
    nuevaOperacion = true; // indicamos que hacemos una nueva operación
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN NUMEROENPROCESO                                           │
// │  Se utiliza para extraer el número que hay en proceso y almacenarlo│
// │  en numEnProceso para poder operar con él                          │
// └────────────────────────────────────────────────────────────────────┘
function numeroEnProceso() {
    // reiniciamos numEnProceso y simboloTemp
    numEnProceso = "";
    simboloTemp = false;

    // recorremos toda la cadena de pantalla1 desde la derecha hacia la izquierda
    for (let i = pantalla1.innerHTML.length; i > 1; i -= 1) {
        // si el dígito i es un símbolo (y no un punto decimal), entendemos que el número en proceso es lo que hemos recorrido

        if (
            isNaN(pantalla1.innerHTML.charAt(i - 1)) == true &&
            simboloTemp == false &&
            pantalla1.innerHTML.charAt(i - 1) != "."
        ) {
            // lo grabamos en numEnProceso
            numEnProceso = pantalla1.innerHTML.substr(
                i,
                pantalla1.innerHTML.length
            );
            // mostramos en pantalla la cadena sin quitar el último operador
            pantalla1.innerHTML = pantalla1.innerHTML.slice(0, i);
            simboloTemp = true;
        }
    }

    // Si hemos recorrido toda la cadena pero no hemos visto ningún símbolo, pasamos todo el valor de pantalla1 o pantalla2 a numEnProceso
    // a numEnProceso y reiniciamos la pantalla

    if (simboloTemp == false) {
        numEnProceso = pantalla1.innerHTML;
        pantalla1.innerHTML = 0;
    }
    // finalmente, si el último carácter es un operador y numEnProceso es "" porque no ha variado de valor durante la comprobación, ponemos a 1 el numEnProceso
    ultimoCaracter();
    if (tipoUltimoCaracter == "operador" && numEnProceso == "") {
        numEnProceso = "1";
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN ULTIMOCARACTER                                            │
// │  Sirve para saber si el último carácter de la cadena es un número, │
// │  si es un operador o un punto decimal                              │
// └────────────────────────────────────────────────────────────────────┘
function ultimoCaracter() {
    // función para saber si el último dígito de pantalla1 es un dígito o símbolo/punto decimal
    tipoUltimoCaracter = "";

    if (
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            pantalla1.innerHTML.substr(-1)
        )
    ) {
        tipoUltimoCaracter = "numero";
    }

    if (["+", "-", "*", "/", "%"].includes(pantalla1.innerHTML.substr(-1))) {
        tipoUltimoCaracter = "operador";
    }

    if (["."].includes(pantalla1.innerHTML.substr(-1))) {
        tipoUltimoCaracter = "punto";
    }

    // indicamos el último carácter de pantalla1 a ultCaracter y penultimo
    ultCaracter = pantalla1.innerHTML.substr(-1, 1);
    penultimo = pantalla1.innerHTML.substr(-2, 1);
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN LIMPIACERO                                                │
// │  Sirve para limpiar pantalla1, por si hubiera un cero inicial      │
// └────────────────────────────────────────────────────────────────────┘
function limpiaCero() {
    // comprobamos si en pantalla1 hay un cero seguido de otro número (no un punto decimal) para borrarlo y limpiar ese número
    if (pantalla1.innerHTML.substring(0, 1) == "0") {
        if (pantalla1.innerHTML.substring(1, 2) != ".") {
            pantalla2.innerHTML = pantalla1.innerHTML.slice(1);
            pantalla1.innerHTML = pantalla1.innerHTML.slice(1);
        }
    }
}

// ┌────────────────────────────────────────────────────────────────────┐
// │  FUNCIÓN CL                                                        │
// │  Hace un console.log personalizado, para ser llamado a menudo      │
// └────────────────────────────────────────────────────────────────────┘
function cl(texto) {
    console.log("─────────────────");
    console.log("Operación: ", texto);
    console.log("nuevaOperacion", nuevaOperacion);
    console.log("pantalla1", pantalla1.innerHTML);
    console.log("pantalla2", pantalla2.innerHTML);
}
