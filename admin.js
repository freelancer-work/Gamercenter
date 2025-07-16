
document.getElementById('productForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('ส่งข้อมูลเรียบร้อย (ตัวอย่าง ไม่เชื่อม API จริง)');
});

// ตัวอย่าง render รายการสินค้า (จริงควรโหลดจาก Sheets)
document.getElementById('admin-product-list').innerHTML = `
  <div class="product-card">
    <img src="https://via.placeholder.com/300x200" />
    <div class="product-info">
      <h3>ตัวอย่างสินค้า</h3>
      <p>100 บาท</p>
      <a href="#">ดูสินค้า</a>
    </div>
  </div>`;
