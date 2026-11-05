// Registro de sobrantes, indicadores, reportes y panel de administracion. - JLA - Parte 4
APP.modulos.push({
    iniciar:function(){
        document.getElementById('formSobrante').addEventListener('submit',evento=>{
            evento.preventDefault();const preparado=Number(document.getElementById('preparado').value);
            const sobrante=Number(document.getElementById('sobrante').value);
            if(!Number.isFinite(preparado)||!Number.isFinite(sobrante)||preparado<=0||sobrante<0||sobrante>preparado){APP.aviso('El sobrante debe ser mayor o igual a cero y no superar la cantidad preparada.',true);return;}
            APP.datos.sobrante.push({id_sobrante:APP.siguiente('sobrante','id_sobrante'),id_evento:Number(document.getElementById('eventoSobrante').value),id_insumo:Number(document.getElementById('insumoSobrante').value),cantidad_preparada:preparado,cantidad_sobrante:sobrante,destino:document.getElementById('destino').value});
            document.getElementById('formSobrante').reset();APP.guardar();APP.aviso('Sobrante registrado correctamente.');
        });
    },
    mostrar:function(){
        APP.opciones(document.getElementById('eventoSobrante'),'evento','id_evento','nombre_cliente');
        APP.opciones(document.getElementById('insumoSobrante'),'insumo','id_insumo','nombre');
        const d=APP.datos;
        document.getElementById('tablaSobrantes').innerHTML=d.sobrante.map(s=>{
            const tasa=s.cantidad_preparada>0?s.cantidad_sobrante/s.cantidad_preparada*100:0;
            return `<tr><td>${APP.seguro(APP.buscar('evento','id_evento',s.id_evento)?.nombre_cliente||'')}</td><td>${APP.seguro(APP.nombre('insumo','id_insumo',s.id_insumo))}</td><td>${APP.numero(s.cantidad_preparada)}</td><td>${APP.numero(s.cantidad_sobrante)}</td><td>${APP.seguro(s.destino)}</td><td>${APP.numero(tasa)}%</td></tr>`;
        }).join('')||'<tr><td colspan="6">Todavía no hay sobrantes registrados.</td></tr>';
        const prep=d.sobrante.reduce((s,x)=>s+Number(x.cantidad_preparada),0);
        const sob=d.sobrante.reduce((s,x)=>s+Number(x.cantidad_sobrante),0);
        const costo=d.calculo_porciones.reduce((s,x)=>s+Number(x.costo_estimado),0);
        document.getElementById('indicadores').innerHTML=`<div class="indicador-grid">
          <div class="indicador">Eventos<strong>${d.evento.length}</strong></div>
          <div class="indicador">Costo estimado calculado<strong>${APP.colones(costo)}</strong></div>
          <div class="indicador">Sobrante registrado<strong>${APP.numero(sob)}</strong></div>
          <div class="indicador">Desperdicio registrado<strong>${prep?APP.numero(sob/prep*100):'0'}%</strong></div>
          </div><p class="ayuda">Las cantidades de distintos insumos no son necesariamente comparables si se usan unidades diferentes. El porcentaje total solo es orientativo.</p>`;
        document.getElementById('tablaReportes').innerHTML=d.evento.map(e=>{
            const c=d.calculo_porciones.filter(x=>x.id_evento===e.id_evento).reduce((s,x)=>s+x.costo_estimado,0);
            const lista=d.sobrante.filter(x=>x.id_evento===e.id_evento);
            const preparado=lista.reduce((s,x)=>s+Number(x.cantidad_preparada),0),restante=lista.reduce((s,x)=>s+Number(x.cantidad_sobrante),0);
            return `<tr><td>${APP.seguro(e.nombre_cliente)}</td><td>${e.invitados_confirmados}</td><td>${APP.colones(c)}</td><td>${APP.numero(restante)}</td><td>${preparado?APP.numero(restante/preparado*100):'0'}%</td></tr>`;
        }).join('')||'<tr><td colspan="5">No hay eventos.</td></tr>';
        document.getElementById('panelAdmin').innerHTML=`<div class="dos-columnas"><div><h3>Roles definidos</h3><ul class="lista-simple">${d.rol.map(r=>`<li>${APP.seguro(r.nombre_rol)}</li>`).join('')}</ul><h3>Usuarios de demostración</h3><ul class="lista-simple">${d.usuario.map(u=>`<li>${APP.seguro(u.nombre)} — ${APP.seguro(u.correo)}</li>`).join('')}</ul></div><div><h3>Categorías</h3><ul class="lista-simple">${d.categoria.map(c=>`<li>${APP.seguro(c.nombre)}</li>`).join('')}</ul><h3>Unidades</h3><ul class="lista-simple">${d.unidad.map(u=>`<li>${APP.seguro(u.nombre)} (${APP.seguro(u.abreviatura)})</li>`).join('')}</ul></div></div>`;
    }
});
