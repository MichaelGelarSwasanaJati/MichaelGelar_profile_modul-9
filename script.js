// MODUL 4: PORTOFOLIO DINAMIS (DOM)
let dataPortofolio = JSON.parse(localStorage.getItem("dataPortofolio")) || [
  { judul: "Desain Banner Informasi", deskripsi: "Merancang visual banner untuk kegiatan acara." },
  { judul: "Program Struktur Data Java", deskripsi: "Implementasi Circular Queue dan manipulasi array." },
  { judul: "Desain Korsa Informatika", deskripsi: "Membuat Desain Korsa Informatika" }
];
const containerPortofolio = document.querySelector("#container-portofolio");
const formPortofolio = document.querySelector("#form-portofolio");

function renderPortofolio() { // modul 7
  containerPortofolio.innerHTML = "";
  
  // Ambil data like dari localStorage 
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};

  dataPortofolio.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card-item";
    
    // Ambil jumlah like berdasarkan judul artikel
    let jumlahLike = semuaLike[item.judul] || 0;

    card.innerHTML = `
      <h3>${item.judul}</h3>
      <p>${item.deskripsi}</p>
      <button class="btn-like">Like (${jumlahLike})</button>
      <button class="btn-hapus-port" data-index="${index}">Hapus</button>
    `;

    // Tambahkan event listener untuk tombol Like
    const tombolLike = card.querySelector(".btn-like");
    tombolLike.addEventListener("click", () => {
      jumlahLike++;
      tombolLike.textContent = `Like (${jumlahLike})`;
      
      // Simpan ke localStorage setiap kali diklik
      simpanLike(item.judul, jumlahLike);
    });

    containerPortofolio.appendChild(card);
  });
} // modul 7 sampai sinii

formPortofolio.addEventListener("submit", (e) => {
  e.preventDefault();
  const judul = document.querySelector("#input-judul").value.trim();
  const deskripsi = document.querySelector("#input-deskripsi").value.trim();
  if (judul && deskripsi) {
    dataPortofolio.push({ judul, deskripsi });

    localStorage.setItem("dataPortofolio", JSON.stringify(dataPortofolio));

    renderPortofolio();
    formPortofolio.reset();
  }
});

containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus-port")) {
    const index = e.target.dataset.index;
    dataPortofolio.splice(index, 1);
    localStorage.setItem("dataPortofolio", JSON.stringify(dataPortofolio));
    renderPortofolio();
  }
});

// MODUL 5: EVENT HANDLING & FORM KOMENTAR
const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanError = document.querySelector("#pesan-error");
const btnHapusSemua = document.querySelector("#btn-hapus-semua");

// Modul 9 Bagian B.2 (Langkah 1: Panggil di Listener submit)
formKomentar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();
  
  if (nama === "" || pesan.length < 5) {
    pesanError.textContent = "Nama wajib diisi dan komentar minimal 5 karakter!";
    pesanError.style.display = "block";
    return;
  }
  pesanError.style.display = "none";

  // Memanggil fungsi POST ke server (untuk menggantikan simpanKomentar localStorage)
  try {
    const hasil = await kirimKomentarKeServer(nama, pesan);
    console.log("Komentar tersimpan di server, id:", hasil.id);
    
    // Modul 9 Bagian B.3 (Langkah 2: Tampilkan respons POST (id))
    const itemKomentar = document.createElement("li");
    itemKomentar.textContent = `${hasil.name}: ${hasil.body}`;
    itemKomentar.dataset.id = hasil.id; // simpan id dari server (untuk update/delete)

    // Menambahkan tombol Like
    const tombolLike = document.createElement("button");
    tombolLike.textContent = "Like (0)"; 
    tombolLike.dataset.likes = 0; // Menyimpan jumlah like awal
    itemKomentar.appendChild(tombolLike);

    // Modul 9 Bagian B.5 - (Langkah 4 (1): Menambahkan tombol hapus)
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    itemKomentar.appendChild(tombolHapus);

    daftarKomentar.appendChild(itemKomentar);

    formKomentar.reset();
  } catch (error) {
    alert("Gagal mengirim komentar, silakan coba lagi.");
    console.error(error);
  }
});

daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus-komentar")) {
    e.target.parentElement.remove();
  }
});

btnHapusSemua.addEventListener("click", () => {
  daftarKomentar.innerHTML = "";
});

// FITUR TOGGLE DARK MODE (Diperbarui untuk Modul 7)

const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");
  
  // Menyimpan status tema ke localStorage
  const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);

  // Ubah teks tombol sesuai kondisi tema
  if (document.body.classList.contains("dark-mode")) {
    tombolTema.textContent = "Mode Terang";
  } else {
    tombolTema.textContent = "Mode Gelap";
  }
}

// Memuat ulang preferensi tema saat halaman dibuka
function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
    if (tombolTema) {
      tombolTema.textContent = "Mode Terang";
    }
  }
}

// Panggil fungsi pemuatan tema saat script pertama kali dimuat[cite: 2]
muatPreferensiTema();

// 1. Toggle via Klik Tombol (Modul 4)
if (tombolTema) {
  tombolTema.addEventListener("click", toggleTema);
}

// 2. Toggle via Shortcut Keyboard Huruf 'D' (Modul 5)
document.addEventListener("keydown", (e) => {
  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    if (e.key.toLowerCase() === "d") {
      toggleTema();
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle-kontak-btn');
    const content = document.getElementById('kontak-content');
    const toggleText = document.getElementById('toggle-text');
    const toggleIcon = document.getElementById('toggle-icon');

    toggleBtn.addEventListener('click', function () {
        const isHidden = content.classList.toggle('hidden');

        if (isHidden) {
            toggleText.textContent = 'Tampilkan Kontak';
            toggleIcon.className = 'fa-solid fa-eye';
            toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            toggleText.textContent = 'Sembunyikan Kontak';
            toggleIcon.className = 'fa-solid fa-eye-slash';
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Fungsi untuk menyimpan jumlah like ke localStorage (Modul 7)
function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

// Fungsi Penyimpanan Komentar (Modul 7)
function simpanKomentar(nama, pesan) {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.push({ nama, pesan });
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

// Fungsi untuk memuat daftar komentar dari localStorage
function muatKomentar() {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  const daftarKomentar = document.querySelector("#daftar-komentar");
  if (daftarKomentar) {
    daftarKomentar.innerHTML = ""; // Bersihkan list sebelum dirender ulang
    daftar.forEach((k) => {
      const li = document.createElement("li");
      li.textContent = `${k.nama}: ${k.pesan}`;
      daftarKomentar.appendChild(li);
    });
  }
}

// Panggil fungsi muat komentar saat script dijalankan
muatKomentar();

    // MODUL 7 — Tombol Reset Seluruh Data tersimpan

const tombolReset = document.querySelector("#btn-reset");
if (tombolReset) {
  tombolReset.addEventListener("click", () => {
    const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar, portofolio)?");
    if (konfirmasi) {
      localStorage.clear(); // Menghapus seluruh data di localStorage browser
      location.reload();    // Memuat ulang halaman agar kembali ke kondisi awal
    }
  });
}

// MODUL 8: FETCH API & JSON
const containerArtikel = document.querySelector("#container-artikel");

async function muatArtikelDariAPI() {
  const loading = document.querySelector("#loading");
  if (loading) loading.style.display = "block"; // Tampilkan loading

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    
    // Periksa apakah respons HTTP berhasil
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    
    const daftarPost = await response.json();
    
    if (containerArtikel) {
      containerArtikel.innerHTML = ""; // untuk membersihkan kontainer sebelum menambahkan artikel baru
      daftarPost.forEach((post) => {
        const article = document.createElement("article");
        
        const judul = document.createElement("h3");
        judul.textContent = post.title;
        
        const isi = document.createElement("p");
        isi.textContent = post.body;
        
        article.appendChild(judul);
        article.appendChild(isi);
        containerArtikel.appendChild(article);
      });
    }

  } catch (error) {
    if (containerArtikel) {
      containerArtikel.innerHTML = "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";
    }
    console.error("Gagal mengambil data:", error);
  } finally {
    if (loading) loading.style.display = "none"; // untuk menyembunyikan loading
  }
}

// menjalankan fungsi muatArtikelDariAPI saat halaman dimuat
muatArtikelDariAPI();

// MODUL 8: Data Pengguna untuk Aside
async function muatProfilPenulis() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) throw new Error("Status: " + response.status);
    
    const user = await response.json();
    document.querySelector("#nama-penulis").textContent = user.name;
    document.querySelector("#email-penulis").textContent = user.email;
  } catch (error) {
    console.error("Gagal memuat profil penulis:", error);
  }
}

muatProfilPenulis();

// Modul 9 Bagian B.2  (Langkah 1: Kirim Komentar (POST))
async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
    });
    
  if (!response.ok) {
    throw new Error("Gagal mengirim komentar, status: " + response.status);
  }
  return await response.json();
}

// Modul 9 Bagian B.4 (Langkah 3: Perbarui like (PATCH))
async function perbaruiLikeKeServer(postId, jumlahLike) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: jumlahLike }),
      });
    if (!response.ok) throw new Error("Status: " + response.status);
    console.log("Like berhasil diperbarui di server");
  } catch (error) {
    console.error("Gagal memperbarui like:", error);
  }
}

// Modul 9 Bagian B.5 (Langkah 4 & Update Like)
daftarKomentar.addEventListener("click", async (e) => {
  // jika tombol HAPUS diklik
  if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: "DELETE",
        });
      if (!response.ok) throw new Error(response.status);
      li.remove(); 
    } catch (error) {
      const statusError = parseInt(error.message);
      alert("Gagal menghapus komentar dari server: " + pesanDariStatus(statusError));
    }
  }

  // jika tombol LIKE diklik
  if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    
    // Tambah angka like di tampilan web
    let jumlahLike = parseInt(e.target.dataset.likes || 0) + 1;
    e.target.dataset.likes = jumlahLike;
    e.target.textContent = `Like (${jumlahLike})`;

    // Modul 9 Bagian B.4 (Panggil fungsi Langkah 3 (PATCH) ke server)
    perbaruiLikeKeServer(id, jumlahLike);
  }
});

// Modul 9 Bagian B.6 (Langkah 5: Menangani status code)
function pesanDariStatus(status) {
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}