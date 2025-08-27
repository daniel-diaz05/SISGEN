document.addEventListener('DOMContentLoaded', function () {
    // --- Funcionalidad para index.html ---
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }

  // --- Funcionalidad para inventario.html ---
  // aceptar ambos ids por compatibilidad con diferentes templates
  const inventarioPage = document.getElementById('tablaInventario') || document.getElementById('tabla-inventario');
  if (inventarioPage) {
        // Alerta control de stock
    const aplicarAlertaStock = () => {
      document.querySelectorAll("#tablaInventario tbody tr").forEach((fila) => {
                const stockTd = fila.children[3];
                if (stockTd) {
                    const stock = parseInt(stockTd.textContent);
                    stockTd.classList.remove("stock-bajo", "stock-alto", "stock-normal");
                    if (!isNaN(stock)) {
                        if (stock < 50) {
                            stockTd.classList.add("stock-bajo");
                        } else if (stock > 4000) {
                            stockTd.classList.add("stock-alto");
                        } else {
                            stockTd.classList.add("stock-normal");
                        }
                    }
                }
            });
        };
        aplicarAlertaStock();

        // Carrito de compras
        let contador = 0;
        const items = [];
  document.querySelectorAll('#tablaInventario .añadir-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-success');
                btn.textContent = 'Añadido';
                btn.disabled = true;

                const fila = btn.closest('tr');
                const producto = fila.children[0].textContent;
                items.push(producto);
                contador++;
                
                const contadorCarrito = document.getElementById("contador-carrito");
                if(contadorCarrito) contadorCarrito.textContent = contador;

                const itemsCarrito = document.getElementById("items-carrito");
                if(itemsCarrito){
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.textContent = producto;
                    itemsCarrito.appendChild(li);
                }
            });
        });

        // Mostrar/ocultar resumen del carrito
        const verCarritoBtn = document.getElementById("ver-carrito");
        if (verCarritoBtn) {
            verCarritoBtn.addEventListener("click", () => {
                const resumenCarrito = document.getElementById("resumen-carrito");
                if(resumenCarrito) resumenCarrito.classList.toggle("d-none");
            });
        }

    }

    // --- Funcionalidad para dashboard.html ---
    const graficoProductos = document.getElementById('graficoProductos');
    if (graficoProductos) {
        try {
            new Chart(graficoProductos.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Tornillos', 'Martillos', 'Taladros', 'Brocas', 'Cintas Métricas', 'Llaves Ajustables'],
                    datasets: [{
                        label: '# de Unidades Vendidas',
                        data: [120, 80, 65, 50, 45, 30],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch(e) {
            console.error("Chart.js error:", e);
        }
    }

    // --- Funcionalidad para pedidos.html ---
    const detallesPedidos = {
      '#001': {
        cliente: 'Juan Pérez',
        productos: [
          'Taladro inalámbrico - 2 unidades',
          'Cinta métrica - 1 unidad'
        ],
        total: '$120.000'
      },
      '#002': {
        cliente: 'Ana Gómez',
        productos: [
          'Martillo de carpintero - 1 unidad',
          'Tornillos - 3 unidades'
        ],
        total: '$180.000'
      }
    };

    const tablaPedidos = document.getElementById('tabla-pedidos');
    const modalDetalles = document.getElementById('modalDetalles');
    if (tablaPedidos && modalDetalles) {
      tablaPedidos.querySelectorAll('button[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener('click', function() {
          const fila = btn.closest('tr');
          const idPedido = fila.children[0].textContent.trim();
          const info = detallesPedidos[idPedido];
          if (info) {
            modalDetalles.querySelector('.modal-body').innerHTML = `
              <p><strong>ID Pedido:</strong> ${idPedido}</p>
              <p><strong>Cliente:</strong> ${info.cliente}</p>
              <p><strong>Productos:</strong></p>
              <ul>${info.productos.map(p => `<li>${p}</li>`).join('')}</ul>
              <p><strong>Total:</strong> ${info.total}</p>
            `;
          }
        });
      });
    }

    // Filtro por texto en pedidos.html
    const inputFiltroPedidos = document.getElementById("filtroPedidos");
    if (inputFiltroPedidos && tablaPedidos) {
      inputFiltroPedidos.addEventListener("input", function () {
        const valor = this.value.toLowerCase();
        tablaPedidos.querySelectorAll("tr").forEach(fila => {
          const texto = fila.textContent.toLowerCase();
          fila.style.display = texto.includes(valor) ? "" : "none";
        });
      });
    }

    // --- Funcionalidad para usuarios.html ---
    const historialUsuarios = {
      'Juan Pérez': [
        { producto: 'Taladro 12V', unidades: 2, fecha: '2025-06-01', valor: '$360.000' },
        { producto: 'Cinta Métrica', unidades: 1, fecha: '2025-06-02', valor: '$10.000' }
      ],
      'Ana Torres': [
        { producto: 'Martillo', unidades: 1, fecha: '2025-06-03', valor: '$25.000' },
        { producto: 'Tornillos', unidades: 10, fecha: '2025-06-04', valor: '$5.000' }
      ]
    };

    // Selecciona la tabla de usuarios de manera más específica
    const tablaUsuarios = document.querySelector('table.table.table-bordered');
    const modalHistorial = document.getElementById('historialModal');
    if (tablaUsuarios && modalHistorial) {
      tablaUsuarios.querySelectorAll('button[data-bs-toggle="modal"][data-bs-target="#historialModal"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
          // Mostrar el modal manualmente por si falla el data-bs-toggle
          if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalHistorial);
            modal.show();
          }
          // Cambiar el contenido del modal
          const fila = btn.closest('tr');
          if (!fila) return;
          const nombre = fila.children[0].textContent.trim();
          const historial = historialUsuarios[nombre];
          // Cambiar título
          modalHistorial.querySelector('.modal-title').textContent = `Historial de Compras - ${nombre}`;
          // Cambiar cuerpo
          let html = '';
          if (historial && historial.length) {
            html += `<table class="table table-striped text-center align-middle"><thead class="table-secondary"><tr><th>Producto</th><th>Unidades</th><th>Fecha</th><th>Valor Total</th></tr></thead><tbody>`;
            historial.forEach(item => {
              html += `<tr><td>${item.producto}</td><td>${item.unidades}</td><td>${item.fecha}</td><td>${item.valor}</td></tr>`;
            });
            html += '</tbody></table>';
          } else {
            html = '<p>No hay historial de compras para este usuario.</p>';
          }
          modalHistorial.querySelector('.modal-body').innerHTML = html;
        });
      });
    }

    // funcionalidad CRUD
    document.querySelectorAll("#tabla-inventario tbody tr").forEach(fila => {
      fila.addEventListener("click", () => {
        const columnas = fila.querySelectorAll("td");

        document.querySelector("#form-producto input[placeholder='Producto']").value = columnas[0].textContent;
        document.querySelector("#form-producto input[placeholder='Descripción']").value = columnas[1].textContent;
        document.querySelector("#form-producto input[placeholder='Categoría']").value = columnas[2].textContent;
        document.querySelector("#form-producto input[placeholder='Stock']").value = columnas[3].textContent;
        document.querySelector("#form-producto input[placeholder='Código']").value = columnas[4].textContent;
        document.querySelector("#precio_compra").value = columnas[5].textContent.replace("$", "").replace(".", "");
        document.querySelector("#precio_venta").value = columnas[6].textContent.replace("$", "").replace(".", "");
      });
    });

    ///
    document.addEventListener("DOMContentLoaded", function () {
      const input = document.getElementById("filtroPedidos");
      const filas = document.querySelectorAll("#tabla-pedidos tbody tr");

      input.addEventListener("input", function () {
        const valor = this.value.toLowerCase();
        filas.forEach(fila => {
          const texto = fila.textContent.toLowerCase();
          fila.style.display = texto.includes(valor) ? "" : "none";
        });
      });
    });
});

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#tabla-pedidos button[data-bs-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const fila = btn.closest('tr');
      const idPedido = fila.children[0].textContent.trim();
      const info = detallesPedidos[idPedido];
      if (info) {
        document.querySelector('#modalDetalles .modal-body').innerHTML = `
          <p><strong>ID Pedido:</strong> ${idPedido}</p>
          <p><strong>Cliente:</strong> ${info.cliente}</p>
          <p><strong>Productos:</strong></p>
          <ul>${info.productos.map(p => `<li>${p}</li>`).join('')}</ul>
          <p><strong>Total:</strong> ${info.total}</p>
        `;
      }
    });
  });
});

// === INVENTARIO: CRUD PHP y MySQL ===
;(function(){
  const tabla = document.getElementById('tablaInventario');
  const form  = document.getElementById('form-producto');
  if(!tabla || !form) return; // Solo corre en inventario.html

let dtInv = null;
  function reinitDataTable(){
    if (typeof $ === 'undefined' || !$('#tabla-inventario').length) return;
    if ($.fn.DataTable.isDataTable('#tabla-inventario')) {
      $('#tabla-inventario').DataTable().clear().destroy();
    }
    dtInv = $('#tabla-inventario').DataTable({
      paging: true,
      pageLength: 10,
      info: false,
      searching: true,   // lo usaremos para buscador global
      ordering: true
    });
  }

  const API = {
    listar    : '../uploads/productos_listar.php',
    crear     : '../uploads/productos_crear.php',
    actualizar: '../uploads/productos_actualizar.php',
    eliminar  : '../uploads/productos_eliminar.php'
  };

const moneda = v => '$' + Number(v||0).toLocaleString('es-CO');

  function pintar(rows){
    tabla.innerHTML = '';
    rows.forEach(p=>{
      tabla.innerHTML += `
        <tr data-id="${p.id}">
          <td>${p.producto}</td>
          <td>${p.descripcion ?? ''}</td>
          <td>${p.categoria ?? ''}</td>
          <td>${p.stock}</td>
          <td>${p.codigo ?? ''}</td>
          <td>${moneda(p.precio_compra)}</td>
          <td>${moneda(p.precio_venta)}</td>
          <td>${p.imagen ? `<img src="../recursos/${p.imagen}" style="max-width:50px">` : ''}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1 btn-editar">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
          </td>
          <td><button class="btn btn-sm btn-primary añadir-btn">Añadir</button></td>
        </tr>`;
    });

    reinitDataTable();

  }

  async function cargar(){
    const r = await fetch(API.listar);
    const txt = await r.text();
    try{
      const data = JSON.parse(txt);
      if (data.error) throw new Error(data.error);
      pintar(data);
      await cargarUltima();
    }catch(e){
      console.error('API listar error:', txt);
      alert('Error cargando inventario: '+e.message);
    }
let dtInv; // fuera de las funciones, una sola vez

function reinitDataTable(){
  if (typeof $ === 'undefined') return; // por si no carga jQuery/DataTables
  // destruye si ya existe
  if ($.fn.DataTable.isDataTable('#tabla-inventario')) {
    $('#tabla-inventario').DataTable().clear().destroy();
  }
  // crea de nuevo
  dtInv = $('#tabla-inventario').DataTable({
    paging: true,
    pageLength: 10,
    info: false,
    searching: false,
    ordering: true
  });
} 
}

  // Crear o actualizar según hidden #id
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const id = fd.get('id');
    const url = id ? API.actualizar : API.crear;
    const r = await fetch(url, { method:'POST', body: fd });
    if(r.ok){
      form.reset();
      form.querySelector('#id').value = '';
      await cargar();
      await cargarUltima();
      alert('Guardado');
    }else{
      alert(await r.text());
    }
  });

  // Editar y eliminar con delegación
  document.addEventListener('click', async (e)=>{
    const row = e.target.closest('tr[data-id]');
    if(!row) return;
    const id = row.getAttribute('data-id');

    if(e.target.classList.contains('btn-editar')){
      const c = row.children;
      form.querySelector('#id').value            = id;
      form.querySelector('#producto').value      = c[0].textContent.trim();
      form.querySelector('#descripcion').value   = c[1].textContent.trim();
      form.querySelector('#categoria').value     = c[2].textContent.trim();
      form.querySelector('#stock').value         = c[3].textContent.trim();
      form.querySelector('#codigo').value        = c[4].textContent.trim();
      form.querySelector('#precio_compra').value = c[5].textContent.replace(/[^\d]/g,'');
      form.querySelector('#precio_venta').value  = c[6].textContent.replace(/[^\d]/g,'');
      const img = row.querySelector('img');
      form.querySelector('#imagen').value        = img ? img.src.split('/').pop() : '';
      window.scrollTo({ top: form.offsetTop-20, behavior:'smooth' });
    }

    if(e.target.classList.contains('btn-eliminar')){
      if(!confirm('¿Eliminar producto?')) return;
      const fd = new FormData(); fd.append('id', id);
      const r = await fetch(API.eliminar, { method:'POST', body: fd });
      if(r.ok){ await cargar(); await cargarUltima();
        alert('Eliminado'); } else { alert(await r.text()); }
    }
  });

const filtroCategoria = document.getElementById('categoriaFiltro');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', () => {
      if (!dtInv) return;
      const val = filtroCategoria.value;
      if (val === 'todos') {
        dtInv.column(2).search('').draw();  // col 2 = Categoría (0‑based)
      } else {
        const esc = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        dtInv.column(2).search('^' + esc + '$', true, false).draw(); // match exacto
      }
    });
  }

  const buscador = document.getElementById('buscador');
  if (buscador) {
    buscador.addEventListener('input', () => {
      if (!dtInv) return;
      dtInv.search(buscador.value).draw();
    });
  }

  cargar();

async function cargarUltima(){
  const r = await fetch('../uploads/inventario_ultima.php?ts=' + Date.now());
  const txt = await r.text();
  try {
    const data = JSON.parse(txt);
    const span = document.getElementById('ultima-actualizacion');
    if(span && data.ultima){
      span.textContent = new Date(data.ultima).toLocaleString('es-CO');
    }
  } catch (e) {
    console.error('inventario_ultima.php no devolvió JSON:', txt);
  }
}
})();

// =======================
// SOLICITUDES (HU3 multi-ítem + HU4 aprobar/rechazar)
// =======================
(function SolicitudesModule(){
  // Ejecutar solo en pedidos.html
  if (!/\/html\/pedidos\.html$/i.test(location.pathname)) return;

  // Capturas (si falta algo crítico, no rompemos)
  const tbSol   = document.getElementById('tbodySolicitudes');
  const selProd = document.getElementById('solProducto');
  const inpCant = document.getElementById('solCantidad');
  const btnAdd  = document.getElementById('btnAgregarItem');
  const btnSend = document.getElementById('btnEnviarSolicitud');
  const inpSolic= document.getElementById('solSolicitante');
  const inpMot  = document.getElementById('solMotivo');
  const tbItems = document.getElementById('tbodyItemsSolicitud');
  const tbDet   = document.getElementById('tbodySolDetalle');

  const hasList = !!tbSol;
  const hasForm = !!(selProd && inpCant && btnAdd && btnSend && inpSolic && tbItems);
  console.log('[SISGEN] pedidos -> hasList:', hasList, 'hasForm:', hasForm);

  const API = {
    productos_listar   : '../uploads/productos_listar.php',
    solicitudes_listar : '../uploads/solicitudes_listar.php',
    solicitudes_crear  : '../uploads/solicitudes_crear.php',
    solicitudes_detalle: '../uploads/solicitudes_detalle.php',
    solicitudes_estado : '../uploads/solicitudes_cambiar_estado.php'
  };

  let items = []; // {producto_id, nombre, cantidad}

  async function poblarProductos(){
    if (!hasForm) return;
    const r = await fetch(API.productos_listar + '?ts=' + Date.now());
    const txt = await r.text();
    let data; try { data = JSON.parse(txt); } catch(e){ console.error('RAW productos:', txt); return; }
    selProd.innerHTML = '<option value="">-- Producto --</option>';
    data.forEach(p => {
      selProd.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.producto} (${p.codigo ?? ''})</option>`);
    });
  }

  async function cargarSolicitudes(){
    if (!hasList) return;
    const r = await fetch(API.solicitudes_listar + '?ts=' + Date.now());
    const txt = await r.text();
    let data; try { data = JSON.parse(txt); } catch(e){ console.error('listar RAW:', txt); return; }
    console.log('[SISGEN] solicitudes_listar -> filas:', Array.isArray(data) ? data.length : 'n/a');
    tbSol.innerHTML = '';
    (data||[]).forEach(s => {
      tbSol.insertAdjacentHTML('beforeend', `
        <tr data-id="${s.id}">
          <td>${s.id}</td>
          <td>${s.solicitante}</td>
          <td>${s.motivo ?? ''}</td>
          <td>${s.items ?? 0}</td>
          <td>${s.total_unidades ?? 0}</td>
          <td class="${
            s.estado==='aprobada' ? 'text-success fw-bold' :
            s.estado==='rechazada' ? 'text-danger fw-bold'  : 'text-warning fw-bold'
          }">${s.estado}</td>
          <td>${new Date(s.fecha).toLocaleString('es-CO')}</td>
          <td>
            <button class="btn btn-sm btn-info btn-ver">Ver</button>
            ${s.estado==='pendiente' ? `
              <button class="btn btn-sm btn-success btn-aprobar">Aprobar</button>
              <button class="btn btn-sm btn-danger btn-rechazar">Rechazar</button>
            ` : ''}
          </td>
        </tr>
      `);
    });
  }

  function renderItems(){
    if (!hasForm) return;
    tbItems.innerHTML = '';
    items.forEach((it, idx)=>{
      tbItems.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${it.nombre}</td>
          <td>${it.cantidad}</td>
          <td><button class="btn btn-sm btn-outline-danger" data-del="${idx}">Quitar</button></td>
        </tr>
      `);
    });
  }

  if (hasForm) {
    btnAdd.addEventListener('click', ()=>{
      const pid  = parseInt(selProd.value || '0', 10);
      const ptxt = selProd.options[selProd.selectedIndex]?.text || '';
      const cant = parseInt(inpCant.value || '0', 10);
      if(!pid || cant<=0){ alert('Selecciona producto y cantidad'); return; }
      const found = items.find(i=>i.producto_id===pid);
      if(found) found.cantidad += cant;
      else items.push({ producto_id: pid, nombre: ptxt, cantidad: cant });
      renderItems();
    });

    tbItems.addEventListener('click', (e)=>{
      const idx = e.target.getAttribute('data-del');
      if(idx !== null){
        items.splice(parseInt(idx,10),1);
        renderItems();
      }
    });

    btnSend.addEventListener('click', async ()=>{
      if(!items.length){ alert('Añade al menos un producto'); return; }
      if(!inpSolic.value.trim()){ alert('Ingresa el solicitante'); return; }
      const fd = new FormData();
      fd.append('solicitante', inpSolic.value.trim());
      fd.append('motivo',      inpMot.value.trim());
      fd.append('items_json',  JSON.stringify(items));
      const r = await fetch(API.solicitudes_crear, { method:'POST', body: fd });
      const resp = await r.json();
      if(resp.ok){
        items = []; renderItems();
        inpSolic.value=''; inpMot.value=''; selProd.value=''; inpCant.value='1';
        await cargarSolicitudes();
        alert('Solicitud creada');
      }else{
        alert(resp.error || 'Error al crear solicitud');
      }
    });
  }

  // Delegación para Ver/Aprobar/Rechazar (solo si hay tabla)
  if (hasList) {
    document.addEventListener('click', async (e)=>{
      const row = e.target.closest('tr[data-id]'); if(!row) return;
      const id = row.getAttribute('data-id');

      if (e.target.classList.contains('btn-ver')) {
        const url = API.solicitudes_detalle + '?id=' + id + '&ts=' + Date.now();
        const r   = await fetch(url);
        const txt = await r.text();
        let data; try { data = JSON.parse(txt); }
        catch { console.error('Detalle no-JSON:', txt); alert('Respuesta inválida del servidor.'); return; }
        if (data && data.ok === false) { alert('No se pudo cargar el detalle: ' + (data.error || 'Error')); return; }
        if (!Array.isArray(data)) { alert('No hay detalle para esta solicitud.'); return; }
        const tbDet = document.getElementById('tbodySolDetalle');
        if (!tbDet) return;
        tbDet.innerHTML = '';
        data.forEach(d => tbDet.insertAdjacentHTML('beforeend', `<tr><td>${d.producto}</td><td>${d.cantidad}</td></tr>`));
        if (typeof bootstrap !== 'undefined') new bootstrap.Modal(document.getElementById('modalSolDetalle')).show();
      }

      if (e.target.classList.contains('btn-aprobar') || e.target.classList.contains('btn-rechazar')) {
        const accion = e.target.classList.contains('btn-aprobar') ? 'aprobar' : 'rechazar';
        const fd = new FormData(); fd.append('id', id); fd.append('accion', accion);
        const r = await fetch(API.solicitudes_estado, { method:'POST', body: fd });
        const resp = await r.json();
        if(resp.ok){ await cargarSolicitudes(); alert(`Solicitud ${accion}da`); }
        else { alert(resp.error || 'No se pudo cambiar el estado'); }
      }
    });
  }

  // Arranque local (sin exportar nada al global)
  (async ()=>{ await poblarProductos(); await cargarSolicitudes(); })();
})();