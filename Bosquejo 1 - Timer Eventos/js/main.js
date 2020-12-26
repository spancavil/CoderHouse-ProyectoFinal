//Declaración de variables, objetos y funciones.

var listaTareas = [];
var tiempoMS = 0;

class Tarea{
    constructor (id, nombreTarea, tiempoTarea){
        this.id = parseInt (id);
        this.nombreTarea = nombreTarea;
        this.tiempoTarea = parseInt(tiempoTarea);
    }

}

//Pasaje de un tiempo de minutos a milisegundos.
function pasajeTiempoAMilisengundos (tiempo){
    return tiempo * 60000;
}

// Genera un retardo de x milisegundos especificados por parámetro.
//Observación: el método now () devuelve la hora actual en ms contados desde enero de 1970, por eso
//el parámetro que le pasemos debe estar en milisegundos para poder compararlo.
function retardo(tiempo){
    tiempo = tiempo + Date.now();
    while (Date.now() < tiempo){}
}

/*
Para implementar a posteriori, cada usuario tendrá un listado de tareas típico.

class Usuario {
    constructor (id, nombreUsuario, apellidoUsuario, claveUsuario){
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.apellidoUsuario = apellidoUsuario;
        this.claveUsuario = claveUsuario;
    }
}
*/

//Aquí empieza la ejecución

var nroTareas = parseInt(prompt("Por favor ingrese la cantidad de tareas que quiere realizar: "));

//Genera la solicitud de las tareas a realizar, en base a la cantidad de tareas especificado previamente.
for (i=1; i<=nroTareas; i++ ){
    let nombreTarea = prompt("Por favor especifique la tarea " + i + ": ");
    let tiempoTarea = parseInt(prompt("Por favor especifique el tiempo en minutos que le llevará la tarea " + i +": "));
    listaTareas.push(new Tarea (i, nombreTarea, tiempoTarea));
}

alert("Tareas cargadas. Cuando desee presione ACEPTAR para empezar.");

// Una vez presionado aceptar, comienza el temporizador para cada tarea.
for (const tarea of listaTareas){
    tiempoMS = pasajeTiempoAMilisengundos(tarea.tiempoTarea);
    retardo(tiempoMS);
    console.log("Fin de tarea " + tarea.id +  ": " + tarea.nombreTarea);
}


