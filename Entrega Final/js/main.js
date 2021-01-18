//Declaración de array y variables auxiliares.

var listaTareas = [];
var listaTareasJSON = [];
var auxiliarTimer = 0;
var tiempoMS = 0;
var contadorBackground = 0;
var contadorTareas = 0;
var audioElement = new Audio ("sound/ping_Notif.mp3");
var audioElement2 = new Audio ("sound/ping_Sucess.mp3");

//Una vez cargado el DOM comienza la ejecución con animaciones.
$(()=>{
    $.getJSON("data/TAREASPRECARGADAS.json",(respuesta)=>{ //Obtenemos los datos desde un JSON en forma estática. Es una petición asíncrona.
        // GUARDAMOS LA RESPUESTA EN UNA VARIABLE DENTRO DE LISTATAREASJSON.
        listaTareasJSON = respuesta;
        console.log (listaTareasJSON);
    });

    $("#row1").hide();
    $("#row2").hide();
    $("#row1").toggle("slow");
    $("#row2").delay(500).toggle("slow");
    escuchaBoton1();
    escuchaBotonSendAll();
    escuchaBotonReset();
})

function escuchaBoton1(){

    //Esuchamos el evento de apretar enter en el input correspondiente.
    $("#inputCantidadTareas").on("keypress", (event)=>{
        if (event.which == 13){
            Button1 (event);
        }
    })

    //Además del enter, creamos un evento al hacer click en el botón correspondiente.
    $("#button1").click((e)=>{ 
        Button1 (e);
        });
}

//Una vez apretado enter o al hacer en #button1 se accede a la función principal. Generamos una validación del primer input. 
function Button1(e){
    //document.getElementById("inputCantidadTareas").disabled = true;
    $("#inputCantidadTareas").prop( "disabled", true );
    //document.getElementById("button1").disabled=true;
    $( "#button1" ).prop( "disabled", true );
    let padre = e.target.parentElement;
    cantidadTareas = parseInt(padre.children[0].value); //EN EL INDICE CERO DEL CHILDREN ENCONTRAMOS EL VALOR DEL INPUT
    if (cantidadTareas>0 && cantidadTareas<100){        //SOLAMENTE SERAN VALIDAS UNA CANTIDAD DE TAREAS ENTRE 1 y 99
        document.getElementById("mensajeError1").style.display = 'none'; //ocultamos el id mensajeError1 con JS plano.
        agregarTablaTareas (cantidadTareas);
    } else{
        mostrarMensajeError1();
        document.getElementById("inputCantidadTareas").disabled = false;
        document.getElementById("button1").disabled             = false;    
    }
}

function escuchaBotonReset(){
    $("#reset").click((e)=>{
        location.reload();
    })
}

//Utilizamos una pequeña animación que me muestra el mensaje de error.
function mostrarMensajeError1 (){
    //document.getElementById("mensajeError1").style.display = 'block';
    $("#mensajeError1").slideDown()
                        .delay(1500)
                        .slideUp();
}

//Mostramos el contenido y la tabla generada con animaciones.
function agregarTablaTareas(cantidadTareas){
    //document.getElementById("textoIngresarListado").style.display = 'block';
    $("#textoIngresarListado").toggle("slow");
    $("#buttonSendAll").toggle("slow");
    crearTabla();
    $("#tablaPadre").toggle("slow");
}

//Creación dinámica de la tabla en base a la cantidad de tareas enviada por el usuario.
function crearTabla(){
    let cantidadColumnas = 2;
    for (let j = 1; j<= cantidadTareas; j++){ //La cantidad de filas corresponde con la cantidad de tareas
      let mensajeError2 = document.createElement("h5");
      mensajeError2.innerHTML = "Error! Escriba un tiempo válido";
      mensajeError2.style.display = 'none';
      mensajeError2.style.color = 'rgb(65, 7, 104)';
      mensajeError2.id = `mensaje${j}`
      let nuevaColumna = document.createElement ("tr");
      $("#tablaPadre").children(1).append(nuevaColumna);
      for (let i = 1; i<= cantidadColumnas; i++){
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

//LIMPIA LOS MENSAJES DE ERROR
function clearMensajesError(){
    for (let i=1; i<=cantidadTareas; i++){
      $(`#mensaje${i}`).css("display", "none");
    }
}

//EN ESTA FUNCION VALIDAMOS LOS VALORES DE LOS TIEMPOS INGRESADOS EN LOS INPUTS DE LA TABLA.
function escuchaBotonSendAll(){
    $("#buttonSendAll").click(()=> { 
        clearMensajesError();
        let columnaTiempo = 2;
        let columnaDescripcion = 1;
        let aux = 0;
        for (let i=1; i<= cantidadTareas; i++){
            valorInput= parseInt($(`#input${i}${columnaTiempo}`).val()); //ACCEDEMOS VALOR POR VALOR A LOS INPUTS QUE CONTIENEN LOS TIEMPOS
            if (valorInput>200 || valorInput<0 || isNaN(valorInput)){
                $(`#mensaje${i}`).slideDown()
                                .delay(1500)
                                .slideUp(); //SE MUESTRA EL MENSAJE DE ERROR EN EL INPUT CORRESPONDIENTE CON UNA ANUMACION
                aux = 1; //SE MODIFICA A 1 el AUX EN CASO DE ERROR
            }
        }
        aux == 0 ? cargaDatos(): "" //OPERADOR TERNARIO. AUX SOLO VALDRA CERO UNA VEZ VALIDADOS TODOS LOS TIEMPOS. Y AHI RECIEN SE CARGAN LOS DATOS.
    });
}

//SE CARGAN LAS TAREAS INGRESADAS EN EL ARRAY LISTATAREAS. RECORDAR QUE SOLO SE ACCEDE UNA VEZ VALIDADOS LOS TIEMPOS
function cargaDatos() {     
    for (i=1; i<=cantidadTareas; i++){
      let columnaTiempo = 2;
      let columnaDescripcion = 1;
      listaTareas.push(new Tarea(i 
                                ,$(`#input${i}${columnaDescripcion}`).val()
                                ,parseInt($(`#input${i}${columnaTiempo}`).val())));
    }
    // console.log(listaTareas); VERIFICACION PARA VER SI CARGARON LOS DATOS EN EL ARRAY
    $("#tablaPadre").prop("disabled", true);
    $("#buttonSendAll").prop("disabled", true);
    localStorage.setItem("listaTareas", JSON.stringify(listaTareas)); //Guardamos la lista en el localStorage utilizando formato JSON
    console.log(listaTareas);
    impresionTemporizada();
}

//SE VAN IMPRIMIENDO LAS TAREAS A MEDIDA QUE VAN PASANDO SUS TIEMPOS CON UNA ANIMACION DE BACKGROUND DE FONDO.
function impresionTemporizada(){
    $("#reset").toggle("slow"); //SE ACTIVA EL BOTON DE RESET.
    //SE ALTERNA EL COLOR DEL BACKGROUND CADA 3 SEGUNDOS.
    let animarBackground = setInterval(()=>{
        contadorBackground +=1;
        if (contadorBackground%2!=0){
            $("body").css({'backgroundColor': "#1D1B4F"});
        }
        else {
            $("body").css({'backgroundColor': "#4267B2"});
        }
        if (contadorTareas == listaTareas.length){
            
            $("body").css({'backgroundColor': "#4267B2"}).delay(1000);
            audioElement2.play(); //UNA VEZ QUE SE IMPRIME TODAS LAS TAREAS SE EJECUTA UN SONIDO DE FINALIZACION DISTINGUIBLE
            clearInterval(animarBackground); //UNA VEZ SE IMPRIMEN TODAS LAS TAREAS SE TERMINA LA ALTERNANCIA DE COLORES

        }
    },3000);

    for (const tarea of listaTareas){
      tiempoMS = pasajeTiempoAMilisengundos(tarea.tiempoTarea);
      auxiliarTimer += tiempoMS; //NECESITAMOS ESTE AUXILIAR PARA QUE SE SUMEN LOS TIEMPOS DE DELAY
      cuentaRegresiva(auxiliarTimer, tarea.id, tarea.nombreTarea);
      if (tarea.id != 1){
        $(`#clock${tarea.id}`).hide(); //Sólo muestra la tarea activa, sin el hide mostraría el temporizador de TODAS las tareas.
      }
    }
  }

//PASAJE DE TIEMPO DE MINUTOS A MILISEGUNDOS.
function pasajeTiempoAMilisengundos (tiempo){
    return tiempo * 60000;
}

//SE GENERA UNA SALIDA DE TAREAS CON CUENTA REGRESIVA EN SEGUNDOS.
function cuentaRegresiva (counter, tareaId, tareaNombre){
    $('#timer').append(`<h3 id="clock${tareaId}" style="display:none;">Segundos restantes: </h3>`);
    $(`#clock${tareaId}`).toggle("slow");
    let interval = setInterval (()=>{ //SE REPITE LA FUNCION ANONIMA CADA 1 SEGUNDO.
        //console.log(counter);
        $(`#clock${tareaId}`).html(`Tarea ${tareaId} "${tareaNombre}" ... segundos restantes: ${(counter -= 1000) / 1000}`); //SE SOBREESCRIBE EL HTML CADA VEZ QUE SE EJECUTA LA FUNCION PARA INDICAR LOS SEGUNDOS RESTANTES.
        if (counter ==0){ //CUANDO EL COUNTER LLEGA A CERO SE LANZA LA NOTIFICACION, SE FRENA El INTERVAL Y SE MUESTRA LA TAREA SIGUIENTE.
            clearInterval(interval);
            $(`#clock${tareaId}`).hide();
            $(`#clock${tareaId}`).html(`Tarea ${tareaId} "${tareaNombre}" FINALIZADA`);
            $(`#clock${tareaId}`).toggle("slow");
            $(`#clock${tareaId+1}`).delay(800).toggle("slow"); //UNA VEZ FINALIZADA LA TAREA ACTIVA, MUESTRA LA TAREA SIGUIENTE.
            contadorTareas +=1; //Esta variable auxiliar nos sirve para terminar la animación de los colores de fondo.
            audioElement.play(); //Cada vez que se termine una tarea se ejecuta un sonido diferenciable.
        }
    }, 1000);
}
