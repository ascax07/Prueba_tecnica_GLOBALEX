document.addEventListener('DOMContentLoaded', async () => {
  // Render navigation
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = `
    <button class="nav-item active" data-view="products" onclick="UI.switchView('products')">
      <span class="icon">📊</span>
      <span>Productos</span>
    </button>
    <button class="nav-item" data-view="categories" onclick="UI.switchView('categories')">
      <span class="icon">🏷️</span>
      <span>Categorías</span>
    </button>
    <button class="nav-item" data-view="ventas" onclick="UI.switchView('ventas')">
      <span class="icon">💰</span>
      <span>Ventas</span>
    </button>
  `;

  // Event Listeners
  document.getElementById('btnNewProduct').addEventListener('click', () => UI.openProductModal());

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => UI.closeProductModal());
  });

  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') UI.closeProductModal();
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const nombre = document.getElementById('productName').value.trim();
    const precio = parseFloat(document.getElementById('productPrice').value);
    const cantidadDisponible = parseInt(document.getElementById('productQuantity').value);
    const categoria = document.getElementById('productCategory').value;
    const descripcion = document.getElementById('productDescription').value.trim();

    if (!nombre || precio <= 0 || cantidadDisponible < 0 || !categoria) {
      UI.showAlert('Validación', 'Completa todos los campos correctamente', 'warning');
      return;
    }

    await Products.save({ nombre, precio, cantidadDisponible, categoria, descripcion });
  });

  document.getElementById('productDescription').addEventListener('input', (e) => {
    document.getElementById('charCount').textContent = `${e.target.value.length}/255`;
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const filtered = allProducts.filter(p =>
      p.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
      p.categoria.toLowerCase().includes(e.target.value.toLowerCase())
    );

    const content = document.getElementById('content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="empty-state">📭 No se encontraron productos</div>';
      return;
    }

    const tbody = content.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = filtered.map(p => `
        <tr>
          <td>#${p.id}</td>
          <td><strong>${p.nombre}</strong></td>
          <td>$${parseFloat(p.precio).toFixed(2)}</td>
          <td>${p.cantidadDisponible}</td>
          <td>${p.categoria}</td>
          <td>${p.descripcion || '-'}</td>
          <td>
            <div class="actions">
              <button class="btn-edit" onclick="Products.edit(${p.id})">✏️</button>
              <button class="btn-sell" onclick="ventas.selectProduct(${p.id})">💳</button>
              <button class="btn-danger" onclick="Products.delete(${p.id})">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  });

  // Load initial data
  await Products.load();
  UI.switchView('products');
});
