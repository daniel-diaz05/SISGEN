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
    const inventarioPage = document.getElementById('tabla-inventario');
    if (inventarioPage) {
        // Alerta control de stock
        const aplicarAlertaStock = () => {
            document.querySelectorAll("#tabla-inventario tbody tr").forEach((fila) => {
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

        // Filtro de búsqueda
        const buscador = document.getElementById('buscador');
        if (buscador) {
            buscador.addEventListener('keyup', function () {
                const filtro = this.value.toLowerCase();
                const filas = document.querySelectorAll("#tabla-inventario tbody tr");
                filas.forEach(fila => {
                    const textoFila = fila.textContent.toLowerCase();
                    fila.style.display = textoFila.includes(filtro) ? '' : 'none';
                });
            });
        }

        // Filtro por categoría
        const filtroCategoria = document.getElementById('categoriaFiltro');
        if (filtroCategoria) {
            const filas = document.querySelectorAll('#tabla-inventario tbody tr');
            filtroCategoria.addEventListener('change', () => {
                const categoria = filtroCategoria.value;
                filas.forEach(fila => {
                    const categoriaFila = fila.children[2].textContent;
                    if (categoria === 'todos' || categoriaFila === categoria) {
                        fila.style.display = '';
                    } else {
                        fila.style.display = 'none';
                    }
                });
            });
        }

        // Carrito de compras
        let contador = 0;
        const items = [];
        document.querySelectorAll('#tabla-inventario .añadir-btn').forEach(btn => {
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

        // Ordenamiento de columnas (con DataTables)
        if (typeof $ !== 'undefined') {
            try {
                $('#tabla-inventario').DataTable({
                    paging: false,
                    info: false,
                    searching: false 
                });
            } catch(e) {
                console.error("DataTables error:", e);
            }
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

