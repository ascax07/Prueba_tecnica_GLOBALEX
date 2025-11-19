const ventas = {
  selectedProductId: null,

  render() {
    const content = document.getElementById('content');

    const html = `
      <div class="ventas-container">
        <h3>Registrar Venta</h3>
        
        <div class="products-grid">
          ${allProducts.map(p => `
            <div class="product-card ${this.selectedProductId === p.id ? 'selected' : ''}" onclick="ventas.selectProduct(${p.id})">
              <h4>${p.nombre}</h4>
              <p>Stock: ${p.cantidadDisponible}</p>
              <p>${p.categoria}</p>
              <div class="product-price">$${parseFloat(p.precio).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>

        <form id="saleForm" onsubmit="ventas.process(event)" style="margin-top: 24px;">
          ${this.selectedProductId ? `
            <div class="form-group">
              <label>Cantidad</label>
              <input type="number" id="saleQuantity" min="1" required autofocus />
            </div>
            <button type="submit" class="btn-primary">Registrar Venta</button>
          ` : '<p style="color: #6b7280;">Selecciona un producto para vender</p>'}
        </form>
      </div>
    `;

    content.innerHTML = html;
  },

  selectProduct(productId) {
    this.selectedProductId = productId;
    this.render();
  },

  async process(e) {
    e.preventDefault();

    const cantidad = parseInt(document.getElementById('saleQuantity').value);
    const product = allProducts.find(p => p.id === this.selectedProductId);

    if (cantidad <= 0) {
      UI.showAlert('Validación', 'La cantidad debe ser mayor a 0', 'warning');
      return;
    }

    if (cantidad > product.cantidadDisponible) {
      UI.showAlert('Stock Insuficiente', `Solo hay ${product.cantidadDisponible} disponibles`, 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${this.selectedProductId}/vender?cantidad=${cantidad}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detalle || 'Error al procesar venta');
      }

      await Products.load();
      this.selectedProductId = null;
      this.render();
      UI.showAlert('Éxito', `Venta registrada: ${cantidad} x ${product.nombre}`, 'success');
    } catch (error) {
      UI.showAlert('Error', error.message, 'error');
    }
  },
};
