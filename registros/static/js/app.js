console.log("Funciona link a app.js");
let peticion_movimientos = new XMLHttpRequest()//creo un objeto de tipo XMLHttpRequest
let peticion_alta = new XMLHttpRequest()
let peticion_baja = new XMLHttpRequest()
let peticion_actualizar = new XMLHttpRequest()

function borrarMovimiento(){
    let id_value = document.getElementById("id").value;
    peticion_baja.open("DELETE",`http://localhost:5000/api/v1.0/delete/${id_value}`);
    peticion_baja.onload = peticion_baja_handler;
    peticion_baja.onerror = function(){alert("No se ha podido completar la peticion de borrado de movimiento")}
    peticion_baja.send();
}

function peticion_baja_handler(){
    if(this.readyState === 4){//para verificar si es una peticion http
        if(this.status === 200){//es para saber si el estado de codigo es el correcto 
            Swal.fire({
                title: "Borrado correcto!",
                icon: "success",
                draggable: true
            });
            console.log("Registro correcto!");
            //limpiar inputs
            limpiarCampos();
            //ocultar formulario
            hideForm();
            //refrescar lista    
            peticion_movimientos.open("GET","http://localhost:5000/api/v1.0/all");
            peticion_movimientos.onload = peticion_movimientos_handler;
            peticion_movimientos.onerror = function(){alert("No se ha podido completar la peticion de movimientos")}
            peticion_movimientos.send();


        }else{
            alert("Se ha producido un error al intentar registrar el movimiento");
        }
    }
}

function updateMovimiento(){
    const date = document.getElementById('date').value;
    const concept = document.getElementById('concept').value;
    const quantity = document.getElementById('quantity').value;

    //control de ingreso de datos
    if(concept === ""){
        alert("Debes agregar un concepto");
        return
    }
    if(quantity == 0 || quantity === ""){
        alert("Debes agregar cantidad positiva o negativa");
        return
    }
    //formateo de datos para capturar fecha actual yyyy-mm-dd
    const hoy = new Date().toISOString().split('T')[0];
    if( !date || date > hoy){
        alert("Debes agregar una fecha menor o igual a hoy");
    }
    //capturamos el id oculto en el formulario
    let id_value = document.getElementById("id").value;

    peticion_actualizar.open("PUT",`http://localhost:5000/api/v1.0/update/${id_value}`);
    peticion_actualizar.onload = peticion_update_handler  
    peticion_actualizar.onerror = function(){alert("No se ha podido completar la peticion PUT")}
    peticion_actualizar.setRequestHeader("Content-Type","application/json")  

    //definir la estructura json y enviar
    const data_json = JSON.stringify(
        {
        "date":date,
        "concept":concept,
        "quantity":quantity
        }
    )

    peticion_actualizar.send( data_json );


}

function altaMovimiento(){
    const date = document.getElementById('date').value;
    const concept = document.getElementById('concept').value;
    const quantity = document.getElementById('quantity').value;

    //control de ingreso de datos
    if(concept === ""){
        alert("Debes agregar un concepto");
        return
    }
    if(quantity == 0 || quantity === ""){
        alert("Debes agregar cantidad positiva o negativa");
        return
    }
    //formateo de datos para capturar fecha actual yyyy-mm-dd
    const hoy = new Date().toISOString().split('T')[0];
    if( !date || date > hoy){
        alert("Debes agregar una fecha menor o igual a hoy");
    }

    peticion_alta.open("POST","http://localhost:5000/api/v1.0/new");
    peticion_alta.onload = peticion_alta_handler  
    peticion_alta.onerror = function(){alert("No se ha podido completar la peticion post")}
    peticion_alta.setRequestHeader("Content-Type","application/json")  

    //definir la estructura json y enviar
    const data_json = JSON.stringify(
        {
        "date":date,
        "concept":concept,
        "quantity":quantity
        }
    )

    peticion_alta.send( data_json );
}

function peticion_update_handler(){
    if(this.readyState === 4){//para verificar si es una peticion http
        if(this.status === 200){//es para saber si el estado de codigo es el correcto 
            Swal.fire({
                title: "Actualización correcta!",
                icon: "success",
                draggable: true
            });
            console.log("Registro correcto!");
            //limpiar inputs
            limpiarCampos();
            //ocultar formulario
            hideForm();
            //refrescar lista    
            peticion_movimientos.open("GET","http://localhost:5000/api/v1.0/all");
            peticion_movimientos.onload = peticion_movimientos_handler;
            peticion_movimientos.onerror = function(){alert("No se ha podido completar la peticion de movimientos")}
            peticion_movimientos.send();


        }else{
            alert("Se ha producido un error al intentar registrar el movimiento");
        }
    }
}

function peticion_alta_handler(){
    if(this.readyState === 4){//para verificar si es una peticion http
        if(this.status === 201){//es para saber si el estado de codigo es el correcto 
            Swal.fire({
                title: "Registro correcto!",
                icon: "success",
                draggable: true
            });
            console.log("Registro correcto!");
            //limpiar inputs
            limpiarCampos();
            //ocultar formulario
            hideForm();
            //refrescar lista    
            peticion_movimientos.open("GET","http://localhost:5000/api/v1.0/all");
            peticion_movimientos.onload = peticion_movimientos_handler;
            peticion_movimientos.onerror = function(){alert("No se ha podido completar la peticion de movimientos")}
            peticion_movimientos.send();


        }else{
            alert("Se ha producido un error al intentar registrar el movimiento");
        }
    }
}

function peticion_movimientos_handler(){
    if(this.readyState === 4){//para verificar si es una peticion http
        if(this.status === 200){//es para saber si el estado de codigo es el correcto 
            //alert(this.responseText);//formato string
            const movimientos = JSON.parse(this.responseText)//convertir string a lista de json
            //datos [{obj1},{obj2}]
            //{ data: [{obj1},{obj2}], status:"Ok"}
            const datos = movimientos.data;
            //limpiar la tabla
            document.getElementById("movements_table").innerHTML="<tr><th>Id</th><th>Fecha</th><th>Concepto</th><th>Cantidad</th></tr>"
           

            if (datos.length===0){
                
                let tabla = document.getElementById("movements_table");

                const fila = document.createElement("tr");

                const celda_vacia = document.createElement("td");
                celda_vacia.innerHTML = "No hay registros de movimientos."
                fila.appendChild(celda_vacia);
                tabla.appendChild(fila);

            }else{

                let tabla = document.getElementById("movements_table");

                for( let i =0;datos.length;i++){

                    const fila = document.createElement("tr");

                    const celda_id = document.createElement("td");
                    celda_id.innerHTML = datos[i].id;
                    fila.appendChild(celda_id);

                    const celda_date = document.createElement("td");
                    celda_date.innerHTML = datos[i].date;
                    fila.appendChild(celda_date);

                    const celda_concept = document.createElement("td");
                    celda_concept.innerHTML = datos[i].concept;
                    fila.appendChild(celda_concept);

                    const celda_quantity = document.createElement("td");
                    celda_quantity.innerHTML = datos[i].quantity;
                    fila.appendChild(celda_quantity);

                    tabla.appendChild(fila);

                }

            }

        }else{
            alert("Se ha producido un error en la consulta http")
        }
    }
}


function viewForm(){
    document.getElementById('movements_detail').style.display="block";
}

function hideForm(){
    limpiarCampos();
    document.getElementById('movements_detail').style.display="none";
}

function capturarItemLista(){

    //accedo a lista table
    const tabla = document.getElementById("movements_table");

    //recorremos todas las listas
    for (let i = 0; i < tabla.rows.length; i++) {
        tabla.rows[i].onclick = function(){
            //obtenemos las celdas de la fila clickeada
            let id = this.cells[0].innerText;
            let fecha = this.cells[1].innerText;
            let concepto = this.cells[2].innerText;
            let monto = this.cells[3].innerText;
            //alert(`fecha: ${fecha}, concepto: ${concepto}, monto: ${monto}`);
            //abrir formulario
            viewForm();

            //acceder a los inputs y agregar los valors
            document.getElementById("id").value = id;
            document.getElementById("date").value = fecha;
            document.getElementById("concept").value = concepto;
            document.getElementById("quantity").value = monto;

        }
        
    }


   

}

function limpiarCampos(){
    document.getElementById("id").value ="";
    document.getElementById("date").value = "";
    document.getElementById("concept").value = "";
    document.getElementById("quantity").value = "";
}

function confirmarBorrado(){
    Swal.fire({
        title: 'Atención',
        text: "¿Estas seguro que deseas eliminar el registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
        }).then((result) => {
        if (result.isConfirmed) {
            borrarMovimiento();
            Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
            });
        }
    });


}


window.onload = function(){

let guardar = document.getElementById('btn_guardar');    
guardar.addEventListener("click",altaMovimiento)

let nuevo = document.getElementById('btn_crear');
nuevo.addEventListener("click",viewForm);

let cerrar = document.getElementById('btn_cerrar');
cerrar.addEventListener("click",hideForm);

peticion_movimientos.open("GET","http://localhost:5000/api/v1.0/all");
peticion_movimientos.onload = peticion_movimientos_handler;
peticion_movimientos.onerror = function(){alert("No se ha podido completar la peticion de movimientos")}
peticion_movimientos.send();

let tabla= document.getElementById('movements_table');
tabla.addEventListener("click",capturarItemLista);

let borrar = document.getElementById("btn_borrar");
borrar.addEventListener("click",confirmarBorrado);

let actualizar = document.getElementById("btn_modificar");
actualizar.addEventListener("click", updateMovimiento);


}