
const sheetURL = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec';
let allProducts = [];

function renderProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  products.forEach(item => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${item.image}" alt="${item.name}" />
        <div class="product-info">
          <h3>${item.name}</h3>
          <p>${item.price} บาท</p>
          <a href="${item.link}" target="_blank">ดูสินค้า</a>
        </div>
      </div>`;
  });
}

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.products;
    renderProducts(allProducts);

    const categorySet = new Set(allProducts.map(p => p.category));
    const filter = document.getElementById('categoryFilter');
    categorySet.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filter.appendChild(option);
    });
  });

document.getElementById('search').addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

document.getElementById('categoryFilter').addEventListener('change', e => {
  const selected = e.target.value;
  renderProducts(selected ? allProducts.filter(p => p.category === selected) : allProducts);
});

// วิเคราะห์จำนวนผู้ใช้งาน
fetch('https://api.countapi.xyz/hit/affiliate-shop/counter')
  .then(res => res.json())
  .then(data => console.log("จำนวนผู้เข้าชม:", data.value));
