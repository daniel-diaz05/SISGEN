// LOGIN
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("../../app/controllers/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
          // Guardar en localStorage
          localStorage.setItem("email", data.email);
          localStorage.setItem("nombre", data.nombre);
          localStorage.setItem("rol", data.rol);

          alert("Inicio de sesión exitoso 🚀");
          window.location.href = "dashboard.html";
        } else {
          alert(data.error || "Credenciales incorrectas ❌");
        }
      } catch (err) {
        console.error("Error en login:", err);
        alert("No se pudo conectar con el servidor");
      }
    });
  }
});


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
  };

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
  if (!tabla || !form) return; // Solo corre en inventario.html

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
      searching: true,
      ordering: true
    });
  }

  const API = {
    listar    : '../../uploads/productos_listar.php',
    crear     : '../../uploads/productos_crear.php',
    actualizar: '../../uploads/productos_actualizar.php',
    eliminar  : '../../uploads/productos_eliminar.php'
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
          <td>${p.imagen ? `<img src="../../public/Recursos/${p.imagen}" style="max-width:50px">` : ''}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1 btn-editar">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
          </td>
          <td>
            <input type="number" id="cant-${p.id}" value="1" min="1" style="width:60px;">
            <button class="btn btn-success btn-sm" 
              onclick="agregarAlCarrito(${p.id}, decodeURIComponent('${encodeURIComponent(p.producto)}'))">
              Añadir
            </button>
          </td>
        </tr>`;
    });
    reinitDataTable();
  }

  async function cargar(){
    const r = await fetch(API.listar);
    const txt = await r.text();
    try {
      const data = JSON.parse(txt);
      if (data.error) throw new Error(data.error);
      pintar(data);
      await cargarUltima();
    } catch(e) {
      console.error('API listar error:', txt);
      alert('Error cargando inventario: '+e.message);
    }
  }

  // Escucha del formulario (ahora sí dentro del mismo bloque)
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const id = fd.get('id');
    const url = id ? API.actualizar : API.crear;
    const r = await fetch(url, { method:'POST', body: fd });
    if (r.ok){
      form.reset();
      form.querySelector('#id').value = '';
      await cargar();
      await cargarUltima();
      alert('Guardado');
    } else {
      alert(await r.text());
    }
  });

  // Delegación para editar y eliminar
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
      if(r.ok){ await cargar(); await cargarUltima(); alert('Eliminado'); }
      else { alert(await r.text()); }
    }
  });

  const filtroCategoria = document.getElementById('categoriaFiltro');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', () => {
      if (!dtInv) return;
      const val = filtroCategoria.value;
      if (val === 'todos') {
        dtInv.column(2).search('').draw();
      } else {
        const esc = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        dtInv.column(2).search('^' + esc + '$', true, false).draw();
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
    const r = await fetch('../../uploads/inventario_ultima.php?ts=' + Date.now());
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

// ================== CARRITO ==================
let carrito = [];

// Agregar producto al carrito
function agregarAlCarrito(id, nombre) {
  id = parseInt(id, 10);
  let input = document.getElementById("cant-" + id);
  let cantidad = parseInt(input.value, 10) || 1;

  let item = carrito.find(i => i.producto_id === id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ producto_id: id, nombre: nombre, cantidad: cantidad });
  }

  renderCarrito();
  input.value = 1; // reset a 1
}

// Mostrar carrito
function renderCarrito() {
  let tbody = document.getElementById("carrito-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  carrito.forEach((item, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${idx})">Quitar</button></td>
      </tr>`;
  });
}

// Quitar del carrito
function eliminarDelCarrito(idx) {
  carrito.splice(idx, 1);
  renderCarrito();
}

// Confirmar compra
async function confirmarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  // datos a enviar
  let data = {
    items: carrito,
    solicitante: localStorage.getItem("email") // usuario logueado
  };

  try {
    let res = await fetch("../../uploads/solicitudes_crear.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    let json = await res.json();

    if (json.ok) {
      alert(json.msg || "Solicitud creada con éxito");
      carrito = [];
      renderCarrito();

      // refrescar inventario
      if (typeof cargarInventario === "function") {
        cargarInventario();
      }
    } else {
      alert(json.msg || "Error al crear solicitud");
    }
  } catch (err) {
    console.error("Error al confirmar compra:", err);
    alert("Error al enviar la solicitud");
  }
}

// Delegar eventos
document.addEventListener("DOMContentLoaded", function() {
  let btnConfirmar = document.getElementById("btn-confirmar-compra");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", confirmarCompra);
  }
});

// COMPRAS.HTML
async function cargarCompras() {
  console.log(" Ejecutando cargarCompras()");
  try {
    let res = await fetch("../../uploads/solicitudes_listar.php");
    console.log(" URL usada:", res.url);
    console.log(" Status:", res.status);

    let solicitudes = await res.json();
    console.log(" Datos recibidos:", solicitudes);

    let tbody = document.getElementById("tablaCompras");
    if (!tbody) {
      console.warn(" No encontré el tbody con id=tablaCompras");
      return;
    }

    tbody.innerHTML = "";
    solicitudes.forEach(s => {
      tbody.innerHTML += `
        <tr>
          <td>${s.id}</td>
          <td>${s.solicitante || "N/A"}</td>
          <td>${s.motivo || ""}</td>
          <td>${s.fecha}</td>
          <td>${s.items} productos / ${s.total_unidades} unidades</td>
          <td>${s.estado}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="verDetalle(${s.id})">Ver detalle</button>
            <button class="btn btn-success btn-sm aprobar-btn admin-only" data-id="${s.id}">Aprobar</button>
            <button class="btn btn-danger btn-sm denegar-btn admin-only" data-id="${s.id}">Denegar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(" Error cargando compras:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tablaCompras")) {
    cargarCompras();
  }
});

async function verDetalle(id) {
  let res = await fetch("../../uploads/solicitudes_detalle.php?id=" + id);
  let items = await res.json();

  let tbody = document.getElementById("detalleSolicitud");
  tbody.innerHTML = "";

  items.forEach(it => {
    tbody.innerHTML += `
      <tr>
        <td>${it.producto}</td>
        <td>${it.cantidad}</td>
      </tr>`;
  });

  let modal = new bootstrap.Modal(document.getElementById("detalleModal"));
  modal.show();
}

document.addEventListener("click", async e => {
  if (e.target.classList.contains("aprobar-btn") || e.target.classList.contains("denegar-btn")) {
    const id = e.target.dataset.id;
    const accion = e.target.classList.contains("aprobar-btn") ? "aprobar" : "rechazar";

    try {
      let res = await fetch("../../uploads/solicitudes_cambiar_estado.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion })
      });
      let data = await res.json();

      if (data.ok) {
        alert(data.msg);
        cargarCompras();
      } else {
        alert("Error: " + (data.msg || data.error));
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  }
});

// usuarios html

async function cargarUsuarios() {
  try {
    let res = await fetch("../../uploads/usuarios_listar.php");
    let usuarios = await res.json();
    console.log(usuarios);

    let tbody = document.getElementById("tablaUsuarios");
    if (!tbody) return;

    tbody.innerHTML = "";
    usuarios.forEach(u => {
      tbody.innerHTML += `
        <tr>
          <td>${u.id}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>${u.rol}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error cargando usuarios:", err);
  }

  document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tablaUsuarios")) {
    cargarUsuarios();
  }
});

}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tablaUsuarios")) {
    cargarUsuarios();
  }
});