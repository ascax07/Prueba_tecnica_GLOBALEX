const Categories = {
  render() {
    const content = document.getElementById('content');
    const categories = [
      { name: 'TECNOLOGIA', icon: '💻', label: 'Tecnología' },
      { name: 'ACCESORIOS', icon: '🎧', label: 'Accesorios' },
      { name: 'OFICINA', icon: '📎', label: 'Oficina' },
    ];

    const html = `
      <div class="categories-grid">
        ${categories.map(cat => {
          const count = allProducts.filter(p => p.categoria === cat.name).length;
          return `
            <div class="category-card">
              <div class="icon">${cat.icon}</div>
              <h3>${cat.label}</h3>
              <p>Gestiona tu inventario</p>
              <span class="count">${count} productos</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    content.innerHTML = html;
  },
};
