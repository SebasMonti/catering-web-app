// Integrante 2: menus, recetas y relacion receta_ingrediente / menu_receta.
APP.modulos.push({
    iniciar:function(){
        document.getElementById('formReceta').addEventListener('submit',evento=>{
            evento.preventDefault();const nombre=document.getElementById('nombreReceta').value.trim();
            const tamano=Number(document.getElementById('tamanoPorcion').value);
            const rendimiento=Number(document.getElementById('rendimiento').value);
            const cantidad=Number(document.getElementById('cantidadReceta').value);
            if(!nombre||tamano<=0||rendimiento<=0||rendimiento>100||cantidad<=0){APP.aviso('Completá los datos válidos de la receta.',true);return;}
            const id=APP.siguiente('receta','id_receta');
            APP.datos.receta.push({id_receta:id,nombre:nombre,tamano_porcion:tamano,unidad_porcion:'g',rendimiento_porcentaje:rendimiento});
            APP.datos.receta_ingrediente.push({id_receta:id,id_insumo:Number(document.getElementById('insumoReceta').value),cantidad_neta:cantidad});
            document.getElementById('formReceta').reset();APP.guardar();APP.aviso('Receta registrada. Podés utilizarla en un menú.');
        });
        document.getElementById('formMenu').addEventListener('submit',evento=>{
            evento.preventDefault();const nombre=document.getElementById('nombreMenu').value.trim();
            const descripcion=document.getElementById('descripcionMenu').value.trim();
            const receta=Number(document.getElementById('recetaMenu').value);
            if(!nombre||!descripcion||!APP.buscar('receta','id_receta',receta)){APP.aviso('Completá los datos válidos del menú.',true);return;}
            const id=APP.siguiente('menu','id_menu');
            APP.datos.menu.push({id_menu:id,nombre:nombre,descripcion:descripcion});
            APP.datos.menu_receta.push({id_menu:id,id_receta:receta});
            document.getElementById('formMenu').reset();APP.guardar();APP.aviso('Menú agregado al catálogo.');
        });
    },
    mostrar:function(){
        APP.opciones(document.getElementById('insumoReceta'),'insumo','id_insumo','nombre');
        APP.opciones(document.getElementById('recetaMenu'),'receta','id_receta','nombre');
        document.getElementById('listaMenus').innerHTML=APP.datos.menu.map(menu=>{
            const recetas=APP.datos.menu_receta.filter(r=>r.id_menu==menu.id_menu).map(r=>APP.nombre('receta','id_receta',r.id_receta));
            return `<p><strong>${APP.seguro(menu.nombre)}</strong> — ${APP.seguro(menu.descripcion)}<br><small>Recetas: ${recetas.map(APP.seguro).join(', ')}</small></p>`;
        }).join('<hr class="separador">');
        document.getElementById('tablaRecetas').innerHTML=APP.datos.receta.map(receta=>{
            const ing=APP.datos.receta_ingrediente.filter(x=>x.id_receta==receta.id_receta).map(x=>{
                const insumo=APP.buscar('insumo','id_insumo',x.id_insumo);
                const unidad=insumo?APP.buscar('unidad','id_unidad',insumo.id_unidad):null;
                return `${APP.seguro(insumo?.nombre||'Desconocido')}: ${APP.numero(x.cantidad_neta)} ${APP.seguro(unidad?.abreviatura||'')}`;
            });
            return `<tr><td>${APP.seguro(receta.nombre)}</td><td>${APP.numero(receta.tamano_porcion)}</td><td>${APP.numero(receta.rendimiento_porcentaje)}%</td><td>${ing.join('<br>')}</td></tr>`;
        }).join('');
    }
});
