// Integrante 3: calculo de porciones, compras e inventario FEFO.
APP.modulos.push({
    iniciar:function(){
        document.getElementById('btnCalcular').addEventListener('click',()=>{
            const id=Number(document.getElementById('eventoCalculo').value);
            const evento=APP.buscar('evento','id_evento',id);
            if(!evento){APP.aviso('Seleccioná un evento.',true);return;}
            const lineas=[];
            const recetas=APP.datos.menu_receta.filter(x=>x.id_menu==evento.id_menu);
            recetas.forEach(rel=>{
                const receta=APP.buscar('receta','id_receta',rel.id_receta);
                if(!receta||Number(receta.rendimiento_porcentaje)<=0)return;
                const factor=Number(receta.rendimiento_porcentaje)/100;
                APP.datos.receta_ingrediente.filter(x=>x.id_receta==rel.id_receta).forEach(ri=>{
                    const cantidad=Number(evento.invitados_confirmados)*Number(ri.cantidad_neta)/factor;
                    const existente=lineas.find(x=>x.id_insumo==ri.id_insumo);
                    if(existente)existente.cantidad_bruta+=cantidad;
                    else lineas.push({id_insumo:ri.id_insumo,cantidad_bruta:cantidad});
                });
            });
            APP.datos.calculo_porciones=APP.datos.calculo_porciones.filter(x=>x.id_evento!==id);
            APP.datos.lista_compras=APP.datos.lista_compras.filter(x=>x.id_evento!==id);
            lineas.forEach(item=>{
                const insumo=APP.buscar('insumo','id_insumo',item.id_insumo);
                if(!insumo)return;
                const cantidad=Number(item.cantidad_bruta),disponible=APP.disponible(item.id_insumo);
                const falta=Math.max(0,cantidad-disponible);
                APP.datos.calculo_porciones.push({id_calculo:APP.siguiente('calculo_porciones','id_calculo'),id_evento:id,id_insumo:item.id_insumo,cantidad_bruta:cantidad,costo_estimado:cantidad*Number(insumo.precio_unitario)});
                if(falta>0)APP.datos.lista_compras.push({id_compra:APP.siguiente('lista_compras','id_compra'),id_evento:id,id_insumo:item.id_insumo,cantidad_faltante:falta,costo_total:falta*Number(insumo.precio_unitario)});
            });
            APP.guardar();APP.aviso('Cálculo generado para el evento '+id+'.');
        });
        document.getElementById('formLote').addEventListener('submit',evento=>{
            evento.preventDefault();const cantidad=Number(document.getElementById('cantidadLote').value);
            const ingreso=document.getElementById('fechaIngreso').value,vence=document.getElementById('fechaVencimiento').value;
            if(!Number.isFinite(cantidad)||cantidad<=0||!ingreso||!vence||vence<ingreso){APP.aviso('La cantidad debe ser positiva y el vencimiento no puede ser anterior al ingreso.',true);return;}
            const id=APP.siguiente('lote','id_lote');
            APP.datos.lote.push({id_lote:id,id_insumo:Number(document.getElementById('insumoLote').value),cantidad_inicial:cantidad,cantidad_actual:cantidad,fecha_ingreso:ingreso,fecha_vencimiento:vence});
            APP.datos.movimiento_stock.push({id_movimiento:APP.siguiente('movimiento_stock','id_movimiento'),id_lote:id,id_evento:null,tipo_movimiento:'entrada',cantidad:cantidad,fecha_movimiento:new Date().toISOString()});
            document.getElementById('formLote').reset();APP.guardar();APP.aviso('Entrada de inventario registrada.');
        });
    },
    mostrar:function(){
        APP.opciones(document.getElementById('eventoCalculo'),'evento','id_evento','nombre_cliente');
        APP.opciones(document.getElementById('insumoLote'),'insumo','id_insumo','nombre');
        const id=Number(document.getElementById('eventoCalculo').value);
        const resultados=APP.datos.calculo_porciones.filter(c=>c.id_evento===id);
        const compras=APP.datos.lista_compras.filter(c=>c.id_evento===id);
        document.getElementById('resumenCalculo').textContent=resultados.length?'Costo total estimado de insumos: '+APP.colones(resultados.reduce((s,c)=>s+c.costo_estimado,0)):'No hay cálculos para este evento.';
        document.getElementById('tablaCalculos').innerHTML=resultados.map(c=>{
            const ins=APP.buscar('insumo','id_insumo',c.id_insumo),dis=APP.disponible(c.id_insumo);
            return `<tr><td>${APP.seguro(ins?.nombre||'')}</td><td>${APP.numero(c.cantidad_bruta)}</td><td>${APP.numero(dis)}</td><td>${APP.numero(Math.max(0,c.cantidad_bruta-dis))}</td><td>${APP.colones(c.costo_estimado)}</td></tr>`;
        }).join('')||'<tr><td colspan="5">Sin resultados.</td></tr>';
        document.getElementById('tablaCompras').innerHTML=compras.map(c=>`<tr><td>${APP.seguro(APP.nombre('insumo','id_insumo',c.id_insumo))}</td><td>${APP.numero(c.cantidad_faltante)}</td><td>${APP.colones(c.costo_total)}</td></tr>`).join('')||'<tr><td colspan="3">No hay faltantes calculados.</td></tr>';
        const hoy=new Date().toISOString().slice(0,10);
        const lotes=[...APP.datos.lote].sort((a,b)=>a.fecha_vencimiento.localeCompare(b.fecha_vencimiento));
        document.getElementById('tablaLotes').innerHTML=lotes.map(l=>{
            const ins=APP.buscar('insumo','id_insumo',l.id_insumo),unidad=APP.buscar('unidad','id_unidad',ins?.id_unidad);
            const dias=Math.round((new Date(l.fecha_vencimiento+'T12:00:00')-new Date(hoy+'T12:00:00'))/86400000);
            const estado=dias<0?'Vencido':dias<=7?'Próximo a vencer':'Vigente';
            return `<tr><td>${l.id_lote}</td><td>${APP.seguro(ins?.nombre||'')}</td><td>${APP.numero(l.cantidad_actual)} ${APP.seguro(unidad?.abreviatura||'')}</td><td>${l.fecha_vencimiento}</td><td class="${dias<=7?'nota-baja':''}">${estado}</td></tr>`;
        }).join('');
        document.getElementById('tablaMovimientos').innerHTML=APP.datos.movimiento_stock.map(m=>`<tr><td>${APP.seguro(m.fecha_movimiento.slice(0,10))}</td><td>${m.id_lote}</td><td>${APP.seguro(m.tipo_movimiento)}</td><td>${APP.numero(m.cantidad)}</td><td>${m.id_evento??'-'}</td></tr>`).join('')||'<tr><td colspan="5">No hay movimientos registrados todavía.</td></tr>';
    }
});
