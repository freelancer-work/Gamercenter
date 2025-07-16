const API_URL = 'https://script.google.com/macros/s/AKfycbyV7B2AfgmmULrTdOPbI6oRbJtF3FRM6_4vvHOrJBvrutWKKH0yaa0gEWRyz95cd4gy8Q/exec';

document.addEventListener('DOMContentLoaded', () => {
  loadPackages();
  loadMembers();

  document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const network = e.target.network.value.trim();
    const price = e.target.price.value.trim();
    const speed = e.target.speed.value.trim();
    const duration = e.target.duration.value.trim();
    const description = e.target.description.value.trim();
    const link = e.target.link.value.trim();

    if (!network || !price || !speed || !duration || !description || !link) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    const data = {
      type: 'add_package',
      network,
      price,
      speed,
      duration,
      description,
      link,
    };

    const res = await postData(data);
    if (res.success) {
      alert('เพิ่มโปรเน็ตเรียบร้อย');
      e.target.reset();
      loadPackages();
    } else {
      alert('เพิ่มโปรเน็ตไม่สำเร็จ');
    }
  });
});

async function loadPackages() {
  const container = document.getElementById('netList');
  container.innerHTML = 'กำลังโหลด...';
  try {
    const res = await fetch(`${API_URL}?type=packages`);
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = '<p>ไม่มีโปรเน็ตในระบบ</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach((pkg) => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <strong>${pkg.network}</strong> - ราคา: ${pkg.price} บาท<br>
        ความเร็ว: ${pkg.speed}, ระยะเวลา: ${pkg.duration}<br>
        รายละเอียด: ${pkg.description}<br>
        <a href="${pkg.link}" target="_blank" rel="noopener">สมัครโปรนี้</a><br>
        <button onclick="editPackage('${pkg.id}')">แก้ไข</button>
        <button onclick="deletePackage('${pkg.id}')">ลบ</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    console.error(err);
  }
}

async function deletePackage(id) {
  if (!confirm('ต้องการลบโปรเน็ตนี้ใช่หรือไม่?')) return;

  const res = await postData({ type: 'delete_package', id });
  if (res.success) {
    alert('ลบโปรเน็ตเรียบร้อย');
    loadPackages();
  } else {
    alert('ลบโปรเน็ตไม่สำเร็จ');
  }
}

async function editPackage(id) {
  const res = await fetch(`${API_URL}?type=packages`);
  const data = await res.json();
  const pkg = data.find((p) => p.id === id);
  if (!pkg) {
    alert('ไม่พบข้อมูลโปรเน็ต');
    return;
  }

  const network = prompt('แก้ไขเครือข่าย', pkg.network);
  if (network === null) return;
  const price = prompt('แก้ไขราคา', pkg.price);
  if (price === null) return;
  const speed = prompt('แก้ไขความเร็ว', pkg.speed);
  if (speed === null) return;
  const duration = prompt('แก้ไขระยะเวลา', pkg.duration);
  if (duration === null) return;
  const description = prompt('แก้ไขรายละเอียด', pkg.description);
  if (description === null) return;
  const link = prompt('แก้ไขลิงก์สมัคร', pkg.link);
  if (link === null) return;

  const updateData = {
    type: 'edit_package',
    id,
    network,
    price,
    speed,
    duration,
    description,
    link,
  };

  const result = await postData(updateData);
  if (result.success) {
    alert('แก้ไขโปรเน็ตเรียบร้อย');
    loadPackages();
  } else {
    alert('แก้ไขโปรเน็ตไม่สำเร็จ');
  }
}

async function loadMembers() {
  const container = document.getElementById('userList');
  container.innerHTML = 'กำลังโหลด...';

  try {
    const res = await fetch(`${API_URL}?type=members`);
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = '<p>ไม่มีสมาชิกในระบบ</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach((user) => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <strong>${user.nickname}</strong> (เบอร์: ${user.phone})<br>
        รหัสผ่าน: ${user.password}<br>
        <button onclick="editMember('${user.id}')">แก้ไข</button>
        <button onclick="deleteMember('${user.id}')">ลบ</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก</p>';
    console.error(err);
  }
}

async function deleteMember(id) {
  if (!confirm('ต้องการลบสมาชิกนี้ใช่หรือไม่?')) return;

  const res = await postData({ type: 'delete_member', id });
  if (res.success) {
    alert('ลบสมาชิกเรียบร้อย');
    loadMembers();
  } else {
    alert('ลบสมาชิกไม่สำเร็จ');
  }
}

async function editMember(id) {
  const res = await fetch(`${API_URL}?type=members`);
  const data = await res.json();
  const user = data.find((u) => u.id === id);
  if (!user) {
    alert('ไม่พบข้อมูลสมาชิก');
    return;
  }

  const phone = prompt('แก้ไขเบอร์โทรศัพท์', user.phone);
  if (phone === null) return;
  const nickname = prompt('แก้ไขชื่อเล่น', user.nickname);
  if (nickname === null) return;
  const password = prompt('แก้ไขรหัสผ่าน', user.password);
  if (password === null) return;

  const updateData = {
    type: 'edit_member',
    id,
    phone,
    nickname,
    password,
  };

  const result = await postData(updateData);
  if (result.success) {
    alert('แก้ไขสมาชิกเรียบร้อย');
    loadMembers();
  } else {
    alert('แก้ไขสมาชิกไม่สำเร็จ');
  }
}

async function postData(data) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('POST error', err);
    return { success: false };
  }
}

function logout() {
  if (confirm('ต้องการออกจากระบบใช่หรือไม่?')) {
    window.location.href = 'admin-login.html';
  }
}
