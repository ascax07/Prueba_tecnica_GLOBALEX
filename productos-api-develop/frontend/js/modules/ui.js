const UI = {
  currentView: 'products',

  showSearchBox(show = true) {
    const searchBox = document.getElementById('searchBox');
    searchBox.style.display = show ? 'flex' : 'none';
  },

  switchView(view) {
    this.currentView = view;

    
    this.showSearchBox(view === 'products');

    
    const content = document.getElementById('content');
    content.innerHTML = '';

    const titles = {
      products: 'Productos',
      categories: 'Categorías',
      ventas: 'Ventas',
    };

    document.getElementById('view-title').textContent = titles[view];

    
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    
    if (view === 'products') Products.render();
    else if (view === 'categories') Categories.render();
    else if (view === 'ventas') ventas.render();
  },

  openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    if (product) {
      document.getElementById('modalTitle').textContent = 'Editar Producto';
      document.getElementById('productName').value = product.nombre;
      document.getElementById('productPrice').value = product.precio;
      document.getElementById('productQuantity').value = product.cantidadDisponible;
      document.getElementById('productCategory').value = product.categoria;
      document.getElementById('productDescription').value = product.descripcion || '';
      document.getElementById('charCount').textContent = `${(product.descripcion || '').length}/255`;
      form.dataset.productId = product.id;
    } else {
      document.getElementById('modalTitle').textContent = 'Nuevo Producto';
      form.reset();
      document.getElementById('charCount').textContent = '0/255';
      delete form.dataset.productId;
    }

    modal.classList.add('active');
  },

  closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
  },

  showAlert(title, message, icon = 'success') {
    Swal.fire({
      title,
      text: message,
      icon,
      confirmButtonColor: '#10b981',
    });
  },
};
