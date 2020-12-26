
//  DECLARACION DE VARIABLES GLOBALES Y OBJETOS
var padreListaTareas = document.getElementById("listaTareas")
var tablaPadre = document.getElementById("tablaPadre");
var salidaListaTareas = document.getElementById("salidaListaTareas");
var cantidadTareas = 0;
var listaTareas = [];

//Aquí empieza la ejecución una vez que esté cargado el DOM correctamente.
$(document).ready(function(){
document.getElementById("button1").onclick = enviarCantidadTareas // SE ASOCIA EL CLICK DEL BOTON CON LA FUNCION ENVIARCANTIDADTAREAS
document.getElementById("buttonSendAll").onclick = validacionTiempos; //SE ASOCIA EL CLICK PRIMERO A LA VALIDACION. EN UN PRINCIPIO ESTA OCULTO.
})

//LA FUNCION ENVIARCANTIDADDETAREAS TAMBIEN ES LLAMADA AL PRESIONAR ENTER QUE CORRESPONDE AL CODIGO 13.
function pulsar (event){
  if (event.which == 13 || event.keyCode == 13){
    enviarCantidadTareas(event);
  }
}

//EN CASO QUE LA CANTIDAD DE TAREAS SEA INVALIDA, SE MUESTRA EL MENSAJE DE ERROR CORRESPONDIENTE
function mostrarMensajeError1 (){
  document.getElementById("mensajeError1").style.display = 'block';
}

//AL ENVIAR EL NUMERO DE TAREAS, TANTO CON CLICK COMO CON ENTER, SE ENVIA ESTE NUMERO A OTRA FUNCION.
function enviarCantidadTareas(event){
  document.getElementById("inputCantidadTareas").disabled = true;  //CON DISABLED HABILITO O DESHABILITO UN ELEMENTO. EL MISMO EFECTO TENDRIA UN REMOVE EVENT LISTENER
  document.getElementById("button1").disabled=true;
  let padre = event.target.parentElement;
  cantidadTareas = parseInt(padre.children[0].value); //EN EL INDICE CERO DEL CHILDREN ENCONTRAMOS EL VALOR DEL INPUT
  if (cantidadTareas>0 && cantidadTareas<100){        //SOLAMENTE SERAN VALIDAS UNA CANTIDAD DE TAREAS ENTRE 1 y 99
    document.getElementById("mensajeError1").style.display = 'none';
    agregarTablaTareas (cantidadTareas);
  } else{
    mostrarMensajeError1();
    document.getElementById("inputCantidadTareas").disabled = false;
    document.getElementById("button1").disabled             = false;
  }
}

//ESTA FUNCION ESTA CONCATENADA CON LA FUNCION ANTERIOR, TOMA EL NUMERO DE TAREAS Y AGREGA INPUTS AL PARENT CORRESPONDIENTE
//ADEMAS SE MUESTRA EL BOTON ENVIAR TODO QUE ESTABA OCULTO.
function agregarTablaTareas(cantidadTareas){
  document.getElementById("textoIngresarListado").style.display = 'block';
  tablaPadre.style.display = 'block'; //SE MUESTRA LA TABLA QUE ESTABA OCULTA
  document.getElementById("buttonSendAll").style.display = 'block'; //SE MUESTRA EL BOTON ENVIAR TODO
  crearTabla();
}
//GENERACION DE LA TABLA
function crearTabla(){
  let cantidadColumnas = 2;
  for (let j = 1; j<= cantidadTareas; j++){ //La cantidad de filas corresponde con la cantidad de tareas
    let mensajeError2 = document.createElement("h5");
    mensajeError2.innerHTML = "Error! Escriba un tiempo válido";
    mensajeError2.style.display = 'none';
    mensajeError2.id = `mensaje${j}`
    let nuevaColumna = document.createElement ("tr");
    tablaPadre.children[1].appendChild(nuevaColumna);
    for (let i = 1; i<= cantidadColumnas; i++){ // i será menor o igual a la cantidad de columnas
      let nuevaCelda = document.createElement ("td");
      let nuevoInput = document.createElement("input");
      nuevoInput.type = "text";
      nuevoInput.id = `input${j}${i}`;         //COLOCAMOS UN ID AL INPUT PARA PODER INGRESAR LUEGO EN LA VALIDACION.
      if (i==1){                               //EN CASO DE ESTAR EN LA COLUMNA 1 SE TRATA DE DESCRIPCION
      nuevoInput.placeholder=`Ingrese la tarea ${j}`;
      } else{                                  //EN CASO DE ESTAR EN LA COLUMNA 2 SE TRATA DEL TIEMPO
      nuevoInput.placeholder=`0-200`;
      }
      tablaPadre.children[1].children[j-1].appendChild(nuevaCelda);
      tablaPadre.children[1].children[j-1].lastElementChild.appendChild(nuevoInput);
      }
    tablaPadre.children[1].children[j-1].lastElementChild.appendChild(mensajeError2); //COLOCAMOS LOS MENSAJES DE ERROR QUE EN UN PRINCIPIO ESTAN OCULTOS.
  }
}

//EN ESTA FUNCION VALIDAMOS LOS VALORES DE LOS TIEMPOS INGRESADOS EN LOS INPUTS DE LA TABLA.
function validacionTiempos(){
  clearMensajesError();
  let columnaTiempo = 2;
  let columnaDescripcion = 1;
  let aux = 0;
  for (let i=1; i<= cantidadTareas; i++){
    valorInput= parseInt(document.getElementById(`input${i}${columnaTiempo}`).value); //ACCEDEMOS VALOR POR VALOR A LOS INPUTS QUE CONTIENEN LOS TIEMPOS
    if (valorInput>200 || valorInput<0 || isNaN(valorInput)){
      document.getElementById(`mensaje${i}`).style.display= 'block'; //SE MUESTRA EL MENSAJE DE ERROR EN EL INPUT CORRESPONDIENTE
      aux = 1;
    }
  }
  aux == 0 ? cargaDatos(): ""; //OPERADOR TERNARIO. AUX SOLO VALDRA CERO UNA VEZ VALIDADOS TODOS LOS TIEMPOS.
}

//SOLO SE CARGARAN LAS TAREAS UNA VEZ QUE ESTEN VALIDADOS TODOS LOS DATOS. ADEMAS SE LOCKEA LOS INPUTS Y EL BUTON ENVIAR TODO
function cargaDatos() {     
    for (i=1; i<=cantidadTareas; i++){
      let columnaTiempo = 2;
      let columnaDescripcion = 1;
      listaTareas.push(new Tarea(i 
                                ,document.getElementById(`input${i}${columnaDescripcion}`).value
                                ,parseInt(document.getElementById(`input${i}${columnaTiempo}`).value)));
    }
    clearMensajesError(); //SE BORRAN LOS MENSAJES DE ERROR
    // console.log(listaTareas); VERIFICACION PARA VER SI CARGARON LOS DATOS EN EL ARRAY
    document.getElementById("tablaPadre").disabled ='true';
    document.getElementById("buttonSendAll").disabled = 'true';
    localStorage.setItem("listaTareas", JSON.stringify(listaTareas)); //Guardamos la lista en el localStorage utilizando formato JSON
    impresionConTimer();
}

//LIMPIA LOS MENSAJES DE ERROR
function clearMensajesError(){
  for (let i=1; i<=cantidadTareas; i++){
    document.getElementById(`mensaje${i}`).style.display= 'none';
  }
}

//UNA VEZ CARGADOS LOS DATOS SE LANZA LA FUNCION DE IMPRESION CON TIMER. OBSERVACION: EN LA CONSOLA SE IMPRIMEN A TIEMPO.
//NO ASI EN EL BROWSER, QUE SE CARGAN LAS TAREAS UNA VEZ FINALIZADO EL PROCESO.
function impresionConTimer(){
  for (const tarea of listaTareas){
    tiempoMS = pasajeTiempoAMilisengundos(tarea.tiempoTarea);
    retardo(1500);
    console.log("Fin de tarea " + tarea.id +  ": " + tarea.nombreTarea);
    let nuevoItemLista = document.createElement ("h3");
    nuevoItemLista.innerHTML = `=> Fin de tarea ${tarea.id}: ${tarea.nombreTarea}<br>`;
    playSound();
    salidaListaTareas.children[0].appendChild(nuevoItemLista);
  }
}

//Genera un retardo de x milisegundos especificados por parámetro.
//Observación: el método now () devuelve la hora actual en ms contados desde enero de 1970, por eso
//el parámetro que le pasemos debe estar en milisegundos para poder compararlo.
function retardo(tiempo){
  tiempo = tiempo + Date.now();
  while (Date.now() < tiempo){}
}

//Pasaje de un tiempo de minutos a milisegundos.
function pasajeTiempoAMilisengundos (tiempo){
  return tiempo * 60000;
}

/*
Para implementar a posteriori, cada usuario tendrá un listado de tareas típico. También podría haber un log in.

class Usuario {
  constructor (id, nombreUsuario, apellidoUsuario, claveUsuario){
      this.id = id;
      this.nombreUsuario = nombreUsuario;
      this.apellidoUsuario = apellidoUsuario;
      this.claveUsuario = claveUsuario;
  }
}
*/
function playSound(){
	var sonido = document.createElement("iframe");
  sonido.setAttribute("src","sound/beep.mp3");
  sonido.style.display = 'none';
	document.body.appendChild(sonido);
}

/*
function callarPajaros(){
	var iframe = document.getElementsByTagName("iframe");

	if (iframe.length > 0){
		iframe[0].parentNode.removeChild(iframe[0]);
		document.getElementById("play").addEventListener("click",sonarPajaros);
	}
}
*/