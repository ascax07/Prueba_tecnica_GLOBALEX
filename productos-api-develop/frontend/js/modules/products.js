const API_URL = 'http://localhost:8080/productos';
let allProducts = [];

const Products = {
  async load() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error cargando productos');
      allProducts = await response.json();
      return allProducts;
    } catch (error) {
      UI.showAlert('Error', error.message, 'error');
      return [];
    }
  },

  render() {
    const content = document.getElementById('content');
    
    if (allProducts.length === 0) {
      content.innerHTML = '<div class="empty-state">📭 No hay productos disponibles</div>';
      return;
    }

    const html = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${allProducts.map(p => `
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
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    content.innerHTML = html;
  },

  async edit(id) {
    const product = allProducts.find(p => p.id === id);
    if (product) UI.openProductModal(product);
  },

  async delete(id) {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');

      allProducts = allProducts.filter(p => p.id !== id);
      this.render();
      UI.showAlert('Éxito', 'Producto eliminado', 'success');
    } catch (error) {
      UI.showAlert('Error', error.message, 'error');
    }
  },

  async save(formData) {
    const id = document.getElementById('productForm').dataset.productId;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detalle || 'Error al guardar');
      }

      await this.load();
      this.render();
      UI.closeProductModal();
      UI.showAlert('Éxito', id ? 'Producto actualizado' : 'Producto creado', 'success');
    } catch (error) {
      UI.showAlert('Error', error.message, 'error');
    }
  },

  filterBySearch(term) {
    if (!term) {
      this.render();
      return;
    }

    const filtered = allProducts.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term)
    );

    const content = document.getElementById('content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="empty-state">📭 No se encontraron productos</div>';
      return;
    }

    allProducts = filtered;
    this.render();
    allProducts = allProducts;
  },
};
