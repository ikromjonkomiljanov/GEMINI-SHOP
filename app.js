// --- DATA ---
const productsData = [
  {
    id: 1,
    name: "Nike Air Max 2024",
    price: 120,
    category: "Shoes",
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 2,
    name: "Smart Watch S7",
    price: 350,
    category: "Electronics",
    tag: "",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    price: 999,
    category: "Electronics",
    tag: "New",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21",
  },
  {
    id: 4,
    name: "MacBook Air M2",
    price: 1100,
    category: "Electronics",
    tag: "",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 400,
    category: "Audio",
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    id: 6,
    name: "Leather Backpack",
    price: 85,
    category: "Accessories",
    tag: "",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
  },
  {
    id: 7,
    name: "Adidas Ultraboost",
    price: 160,
    category: "Shoes",
    tag: "",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    price: 145,
    category: "Electronics",
    tag: "Trend",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
  },
  {
    id: 9,
    name: "Coffee Maker",
    price: 210,
    category: "Home",
    tag: "",
    image: "https://images.unsplash.com/photo-1520970014086-2208bd4a309b",
  },
  {
    id: 10,
    name: "Gaming Mouse",
    price: 65,
    category: "Electronics",
    tag: "Hot",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  },
];

let cart = JSON.parse(localStorage.getItem("shop_cart")) || [];
let isLoginMode = false;

// --- AUTH LOGIC ---
function toggleAuthModal() {
  document.getElementById("auth-modal").classList.toggle("hidden");
}

function switchAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById("modal-title").innerText = isLoginMode
    ? "Tizimga kirish"
    : "Ro'yxatdan o'tish";
  document.getElementById("name-field").style.display = isLoginMode
    ? "none"
    : "block";
  document.getElementById("auth-submit-btn").innerText = isLoginMode
    ? "Login"
    : "Signup";
  document.getElementById("switch-auth").innerText = isLoginMode
    ? "Ro'yxatdan o'tish"
    : "Kirish";
}

document.getElementById("auth-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;

  if (!isLoginMode) {
    const userData = { name, email };
    localStorage.setItem("currentUser", JSON.stringify(userData));
    updateUserUI(userData);
  } else {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser && savedUser.email === email) {
      updateUserUI(savedUser);
    } else {
      alert("Ma'lumot topilmadi!");
      return;
    }
  }
  toggleAuthModal();
});

function updateUserUI(user) {
  const icon = document.getElementById("user-icon");
  const initials = document.getElementById("user-initials");
  if (user && user.name) {
    const parts = user.name.split(" ");
    const text =
      parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0] + parts[0][1];
    icon.classList.add("hidden");
    initials.innerText = text.toUpperCase();
    initials.classList.remove("hidden");
  }
}

// --- PRODUCT RENDER ---
function renderProducts(data) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = data
    .map(
      (p) => `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition group">
                    <div class="h-40 bg-gray-100 relative overflow-hidden">
                        <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        ${p.tag ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">${p.tag}</span>` : ""}
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-gray-800 truncate text-sm">${p.name}</h3>
                        <div class="flex justify-between items-center mt-3">
                            <span class="font-black text-indigo-600">$${p.price}</span>
                            <button onclick="addToCart(${p.id})" class="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-600 hover:text-white transition">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `,
    )
    .join("");
}

// --- CART LOGIC ---
function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const content = document.getElementById("cart-content");

  drawer.classList.toggle("invisible");
  overlay.classList.toggle("opacity-100");
  content.classList.toggle("translate-x-0");
  updateCartUI();
}

function addToCart(id) {
  const product = productsData.find((p) => p.id === id);
  const exist = cart.find((item) => item.id === id);
  if (exist) {
    exist.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  // Savatcha tugmasi qimirlashi uchun effekt
  const badge = document.getElementById("cart-count");
  badge.classList.add("scale-150");
  setTimeout(() => badge.classList.remove("scale-150"), 200);
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) cart = cart.filter((i) => i.id !== id);
    saveCart();
    updateCartUI();
  }
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("shop_cart", JSON.stringify(cart));
  document.getElementById("cart-count").innerText = cart.reduce(
    (a, b) => a + b.quantity,
    0,
  );
}

function updateCartUI() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (cart.length === 0) {
    container.innerHTML = "Savatchangiz bo'sh...";
    totalEl.innerText = "$0.00";
    return;
  }
  let total = 0;
  container.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `
                <div class="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl">
                    <img src="${item.image}" class="w-12 h-12 object-cover rounded-lg">
                    <div class="flex-grow min-w-0">
                        <h4 class="text-xs font-bold truncate">${item.name}</h4>
                        <div class="flex items-center space-x-2 mt-1">
                            <button onclick="updateQty(${item.id}, -1)" class="w-5 h-5 border rounded bg-white">-</button>
                            <span class="text-xs font-bold">${item.quantity}</span>
                            <button onclick="updateQty(${item.id}, 1)" class="w-5 h-5 border rounded bg-white">+</button>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-indigo-600">$${item.price * item.quantity}</span>
                    <button onclick="removeItem(${item.id})" class="text-red-400 p-1">✕</button>
                </div>`;
    })
    .join("");
  totalEl.innerText = `$${total.toFixed(2)}`;
}

// Qidiruv
document.getElementById("main-search").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(term),
  );
  renderProducts(filtered);
});

// Sahifa yuklanganda
window.onload = () => {
  renderProducts(productsData);
  saveCart(); // Badge-ni yangilash
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) updateUserUI(user);
};

// 1. Profil tugmasi bosilganda
function handleProfileClick() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    // Agar login qilgan bo'lsa, menyuni ko'rsat
    const menu = document.getElementById("user-menu");
    document.getElementById("menu-user-name").innerText = user.name;
    document.getElementById("menu-user-email").innerText = user.email;
    menu.classList.toggle("hidden");
  } else {
    // Agar kirmagan bo'lsa, Login modalini och
    toggleAuthModal();
  }
}

// 2. Tizimdan chiqish funksiyasi
function logout() {
  // LocalStoragedan foydalanuvchini o'chiramiz
  localStorage.removeItem("currentUser");

  // UI-ni boshlang'ich holatga qaytaramiz
  document.getElementById("user-icon").classList.remove("hidden");
  document.getElementById("user-initials").classList.add("hidden");
  document.getElementById("user-menu").classList.add("hidden");
  document.getElementById("user-trigger").classList.remove("bg-indigo-50");

  alert("Tizimdan chiqdingiz!");
  // Sahifani yangilash (ixtiyoriy, lekin tozalash uchun yaxshi)
  window.location.reload();
}

// Menudan tashqariga bosilganda yopish
window.addEventListener("click", (e) => {
  const menu = document.getElementById("user-menu");
  const trigger = document.getElementById("user-trigger");
  if (!trigger.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});
