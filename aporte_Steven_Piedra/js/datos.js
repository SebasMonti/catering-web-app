// Datos de demostracion. Los nombres de las colecciones siguen el diagrama relacional.
const DATOS_INICIALES = {
  categoria:[{id_categoria:1,nombre:'Proteínas'},{id_categoria:2,nombre:'Vegetales'},{id_categoria:3,nombre:'Granos'}],
  unidad:[{id_unidad:1,nombre:'Gramo',abreviatura:'g'},{id_unidad:2,nombre:'Unidad',abreviatura:'und'}],
  rol:[{id_rol:1,nombre_rol:'Administrador'},{id_rol:2,nombre_rol:'Operativo'}],
  usuario:[{id_usuario:1,nombre:'Usuario de demostración',correo:'demo@ejemplo.test',id_rol:1}],
  insumo:[
    {id_insumo:1,nombre:'Arroz',id_categoria:3,id_unidad:1,precio_unitario:1.4,stock_minimo:2000},
    {id_insumo:2,nombre:'Pollo',id_categoria:1,id_unidad:1,precio_unitario:4.2,stock_minimo:1500},
    {id_insumo:3,nombre:'Zanahoria',id_categoria:2,id_unidad:1,precio_unitario:1.1,stock_minimo:700},
    {id_insumo:4,nombre:'Papa',id_categoria:2,id_unidad:1,precio_unitario:0.9,stock_minimo:1000}
  ],
  lote:[
    {id_lote:1,id_insumo:1,cantidad_inicial:8000,cantidad_actual:8000,fecha_ingreso:'2026-11-01',fecha_vencimiento:'2026-12-15'},
    {id_lote:2,id_insumo:2,cantidad_inicial:5000,cantidad_actual:5000,fecha_ingreso:'2026-11-01',fecha_vencimiento:'2026-11-12'},
    {id_lote:3,id_insumo:3,cantidad_inicial:3000,cantidad_actual:3000,fecha_ingreso:'2026-11-01',fecha_vencimiento:'2026-11-20'},
    {id_lote:4,id_insumo:4,cantidad_inicial:4500,cantidad_actual:4500,fecha_ingreso:'2026-11-01',fecha_vencimiento:'2026-11-25'}
  ],
  receta:[
    {id_receta:1,nombre:'Arroz con pollo',tamano_porcion:250,unidad_porcion:'g',rendimiento_porcentaje:90},
    {id_receta:2,nombre:'Papas y zanahorias',tamano_porcion:180,unidad_porcion:'g',rendimiento_porcentaje:85}
  ],
  receta_ingrediente:[
    {id_receta:1,id_insumo:1,cantidad_neta:120},{id_receta:1,id_insumo:2,cantidad_neta:130},
    {id_receta:2,id_insumo:3,cantidad_neta:80},{id_receta:2,id_insumo:4,cantidad_neta:100}
  ],
  menu:[{id_menu:1,nombre:'Menú clásico',descripcion:'Arroz con pollo y guarnición'}],
  menu_receta:[{id_menu:1,id_receta:1},{id_menu:1,id_receta:2}],
  evento:[{id_evento:1,id_usuario:1,nombre_cliente:'Cliente de ejemplo',correo_cliente:'cliente@ejemplo.test',telefono_cliente:'8888-8888',fecha_evento:'2026-11-18',hora_evento:'12:00',lugar:'San José',tipo_evento:'Corporativo',invitados_confirmados:30,id_menu:1,estado:'cotizado'}],
  calculo_porciones:[],lista_compras:[],movimiento_stock:[],sobrante:[]
};
