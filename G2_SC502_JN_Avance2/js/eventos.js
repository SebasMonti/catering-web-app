// Integrante 1: modulo de eventos.
APP.modulos.push({
    iniciar:function(){
        document.getElementById('formEvento').addEventListener('submit',evento=>{
            evento.preventDefault();const valor=id=>document.getElementById(id).value.trim();
            const invitados=Number(valor('invitados'));
            if(!Number.isInteger(invitados)||invitados<1){APP.aviso('Ingrese una cantidad válida de invitados.',true);return;}
            const nuevo={id_evento:APP.siguiente('evento','id_evento'),id_usuario:1,nombre_cliente:valor('cliente'),correo_cliente:valor('correo'),telefono_cliente:valor('telefono'),fecha_evento:valor('fechaEvento'),hora_evento:valor('horaEvento'),lugar:valor('lugar'),tipo_evento:valor('tipoEvento'),invitados_confirmados:invitados,id_menu:Number(valor('menuEvento')),estado:'cotizado'};
            APP.datos.evento.push(nuevo);document.getElementById('formEvento').reset();APP.guardar();APP.aviso('Evento registrado correctamente. Ahora podés calcular sus insumos.');
        });
        document.getElementById('tablaEventos').addEventListener('click',evento=>{
            const boton=evento.target.closest('[data-evento]');if(!boton)return;
            const id=Number(boton.dataset.evento),item=APP.buscar('evento','id_evento',id);
            if(!item)return;
            if(item.estado==='cotizado')item.estado='confirmado';
            else if(item.estado==='confirmado')item.estado='realizado';
            else return;
            APP.guardar();APP.aviso('Estado del evento actualizado. La existencia del inventario no se descuenta automáticamente en este prototipo.');
        });
    },
    mostrar:function(){
        APP.opciones(document.getElementById('menuEvento'),'menu','id_menu','nombre');
        document.getElementById('tablaEventos').innerHTML=APP.datos.evento.map(e=>{
            let accion=e.estado==='cotizado'?'Confirmar':e.estado==='confirmado'?'Marcar realizado':'Finalizado';
            return `<tr><td>${e.id_evento}</td><td>${APP.seguro(e.nombre_cliente)}</td><td>${APP.seguro(e.fecha_evento)}</td><td>${e.invitados_confirmados}</td><td>${APP.seguro(APP.nombre('menu','id_menu',e.id_menu))}</td><td><span class="estado">${APP.seguro(e.estado)}</span></td><td>${e.estado==='realizado'?'-':`<button class="boton-pequeno" type="button" data-evento="${e.id_evento}">${accion}</button>`}</td></tr>`;
        }).join('')||'<tr><td colspan="7">No hay eventos registrados.</td></tr>';
    }
});
