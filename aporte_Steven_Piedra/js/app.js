// Integrante 1: base comun, navegacion, eventos y pantalla principal.
const APP = {
    key:'catering_sc502_demo_v1', datos:{}, modulos:[],
    iniciar:function(){
        try { const guardado=localStorage.getItem(this.key); this.datos=guardado?JSON.parse(guardado):JSON.parse(JSON.stringify(DATOS_INICIALES)); }
        catch(error){this.datos=JSON.parse(JSON.stringify(DATOS_INICIALES));}
        document.querySelectorAll('[data-vista]').forEach(boton=>boton.addEventListener('click',()=>this.ir(boton.dataset.vista)));
        document.getElementById('reiniciarDatos').addEventListener('click',()=>{
            if(confirm('¿Restablecer todos los datos locales del prototipo?')) {localStorage.removeItem(this.key);location.reload();}
        });
        this.modulos.forEach(modulo=>modulo.iniciar()); this.actualizar();
    },
    guardar:function(){localStorage.setItem(this.key,JSON.stringify(this.datos));this.actualizar();},
    actualizar:function(){this.modulos.forEach(modulo=>modulo.mostrar());this.panelInicio();},
    ir:function(vista){
        document.querySelectorAll('.vista').forEach(item=>item.classList.toggle('activa',item.id==='vista-'+vista));
        document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('activo',b.dataset.vista===vista));
        this.actualizar();
    },
    aviso:function(texto,error=false){const elemento=document.getElementById('mensajeGlobal');elemento.textContent=texto;elemento.className='mensaje'+(error?' error':'');window.scrollTo(0,0);},
    limpiarAviso:function(){document.getElementById('mensajeGlobal').className='mensaje oculto';},
    siguiente:function(tabla,id){return Math.max(0,...this.datos[tabla].map(item=>Number(item[id])||0))+1;},
    buscar:function(tabla,id,valor){return this.datos[tabla].find(item=>Number(item[id])===Number(valor));},
    nombre:function(tabla,id,valor){const item=this.buscar(tabla,id,valor);return item?(item.nombre||item.nombre_rol):'No encontrado';},
    seguro:function(valor){return String(valor??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');},
    numero:function(valor){return Number(valor||0).toLocaleString('es-CR',{maximumFractionDigits:2});},
    colones:function(valor){return '₡'+Number(valor||0).toLocaleString('es-CR',{minimumFractionDigits:2,maximumFractionDigits:2});},
    opciones:function(elemento,tabla,id,texto,seleccion){
        const actual=seleccion===undefined?elemento.value:String(seleccion);
        elemento.innerHTML=this.datos[tabla].map(item=>`<option value="${item[id]}">${this.seguro(item[texto])}</option>`).join('');
        if([...elemento.options].some(op=>op.value===actual))elemento.value=actual;
    },
    disponible:function(idInsumo){return this.datos.lote.filter(l=>l.id_insumo==idInsumo).reduce((s,l)=>s+Number(l.cantidad_actual),0);},
    panelInicio:function(){
        const d=this.datos;const alertas=d.insumo.filter(i=>this.disponible(i.id_insumo)<Number(i.stock_minimo)).length;
        document.getElementById('panelInicio').innerHTML=`<div class="indicador-grid">
          <div class="indicador">Eventos registrados<strong>${d.evento.length}</strong></div>
          <div class="indicador">Menús disponibles<strong>${d.menu.length}</strong></div>
          <div class="indicador">Insumos bajo mínimo<strong>${alertas}</strong></div>
          <div class="indicador">Registros de sobrantes<strong>${d.sobrante.length}</strong></div>
        </div><div class="tarjeta"><h3>Flujo de trabajo</h3><p>1. Registrar evento → 2. Elegir menú → 3. Calcular insumos y compras → 4. Revisar inventario → 5. Registrar sobrantes → 6. Consultar reportes.</p><p class="ayuda">Los datos se guardan en este navegador mediante localStorage. No hay acceso real a MySQL, autenticación ni reservas de inventario en esta entrega Front End.</p></div>`;
    }
};
document.addEventListener('DOMContentLoaded',()=>APP.iniciar());
