
const foods = [
  {id:1, name:"Chicken Biryani", category:"Biryani", price:180, emoji:"🍗", desc:"Aromatic rice with delicious spices.", image:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=650&q=80"},
  {id:2, name:"Veg Biryani", category:"Biryani", price:130, emoji:"🍚", desc:"Flavourful rice with fresh vegetables.", image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=650&q=80"},
  {id:3, name:"Classic Burger", category:"Burger", price:120, emoji:"🍔", desc:"Juicy patty, fresh lettuce and sauce.", image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=650&q=80"},
  {id:4, name:"Cheese Burger", category:"Burger", price:160, emoji:"🍔", desc:"Melty cheese in every single bite.", image:"https://images.unsplash.com/photo-155 burger?auto=format&fit=crop&w=650&q=80".replace("photo-155 burger","photo-1550547660-d9450f859349")},
  {id:5, name:"Margherita Pizza", category:"Pizza", price:220, emoji:"🍕", desc:"Cheese, tomato and Italian herbs.", image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=650&q=80"},
  {id:6, name:"Pepperoni Pizza", category:"Pizza", price:280, emoji:"🍕", desc:"A classic pizza packed with flavour.", image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=650&q=80"},
  {id:7, name:"Crispy Fries", category:"Fries", price:80, emoji:"🍟", desc:"Golden, crunchy and perfectly salted.", image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=650&q=80"},
  {id:8, name:"Peri Peri Fries", category:"Fries", price:110, emoji:"🍟", desc:"Crispy fries with a spicy kick.", image:"https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=650&q=80"},
  {id:9, name:"Fresh Orange Juice", category:"Juice", price:70, emoji:"🥤", desc:"Refreshing citrus goodness.", image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=650&q=80"},
  {id:10, name:"Mango Juice", category:"Juice", price:90, emoji:"🥭", desc:"Sweet, sunny and full of mango flavour.", image:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=650&q=80"},
  {id:11, name:"Masala Tea", category:"Tea", price:25, emoji:"☕", desc:"Comfort in a warm, fragrant cup.", image:"https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=650&q=80"},
  {id:12, name:"Cold Coffee", category:"Coffee", price:100, emoji:"🧋", desc:"Creamy coffee for a happy break.", image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=650&q=80"}
];

const categories = ["All","Biryani","Burger","Pizza","Fries","Juice","Tea","Coffee"];
let selectedCategory = "All";
let cart = [];
let currentPage = "home";

const money = amount => "₹" + amount.toLocaleString("en-IN");

function showPage(page) {
  if (page === "checkout" && cart.length === 0) {
    alert("Your cart is empty! Please add some delicious food first.");
    page = "menu";
  }

  currentPage = page;
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === page);
  });

  if (page === "cart") renderCart();
  if (page === "checkout") {
    document.getElementById("checkout-total").textContent =
      "Your total: " + money(getTotal());
  }

  history.replaceState(null, "", "#" + page);
  window.scrollTo({top:0, behavior:"smooth"});
}

function renderCategories() {
  document.getElementById("categories").innerHTML = categories.map(category =>
    `<button class="category-btn ${selectedCategory === category ? "active" : ""}"
      data-category="${category}">${category}</button>`
  ).join("");
}

function renderFoods() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const sort = document.getElementById("sort").value;

  let filtered = foods.filter(food =>
    (selectedCategory === "All" || food.category === selectedCategory) &&
    (food.name.toLowerCase().includes(query) ||
     food.category.toLowerCase().includes(query) ||
     food.desc.toLowerCase().includes(query))
  );

  if (sort === "low") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high") filtered.sort((a,b) => b.price - a.price);

  const grid = document.getElementById("food-grid");

  if (!filtered.length) {
    grid.innerHTML = "<p>No food found. Try another search!</p>";
    return;
  }

  grid.innerHTML = filtered.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy"
        onerror="this.style.display='none'">
      <div class="food-info">
        <h3>${food.emoji} ${food.name}</h3>
        <p>${food.desc}</p>
        <div class="food-bottom">
          <span class="price">${money(food.price)}</span>
          <button class="add-btn" data-add="${food.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const food = foods.find(item => item.id === id);
  if (!food) return;

  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty++;
  else cart.push({...food, qty:1});

  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent =
    cart.reduce((sum,item) => sum + item.qty, 0);
}

function getTotal() {
  return cart.reduce((sum,item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const container = document.getElementById("cart-items");

  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Your cart is waiting for something delicious ♡</p>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.emoji} ${item.name}</strong>
          <p>${money(item.price)} each</p>
        </div>
        <div class="qty-controls">
          <button data-change="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-change="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      </div>
    `).join("");
  }

  document.getElementById("cart-total").textContent = money(getTotal());
  updateCartCount();
}

function changeQuantity(id, delta) {
  const item = cart.find(food => food.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(food => food.id !== id);
  renderCart();
}

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  renderCategories();
  renderFoods();
});

document.getElementById("food-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (button) changeQuantity(Number(button.dataset.change), Number(button.dataset.delta));
});

document.getElementById("search").addEventListener("input", renderFoods);
document.getElementById("sort").addEventListener("change", renderFoods);

document.getElementById("checkout-form").addEventListener("submit", event => {
  event.preventDefault();

  if (!cart.length) {
    alert("Please add food to your cart first.");
    showPage("menu");
    return;
  }

  const form = new FormData(event.target);
  const customerName = String(form.get("name")).replace(/[<>&"]/g, "");
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const total = getTotal();

  document.getElementById("order-message").textContent =
    `Thank you, ${customerName}! Demo order #${orderNumber}. Total: ${money(total)}. Payment: ${form.get("payment")}.`;

  cart = [];
  updateCartCount();
  event.target.reset();
  showPage("success");
});

// Navigation links open the matching page.
document.querySelectorAll('nav a, .logo[href="#home"]').forEach(link => {
  link.addEventListener("click", event => {
    const page = link.getAttribute("href").slice(1);
    if (document.getElementById(page)?.classList.contains("page")) {
      event.preventDefault();
      showPage(page);
    }
  });
});

// Open the page requested by the URL hash.
renderCategories();
renderFoods();

const initialPage = location.hash.slice(1);
showPage(document.getElementById(initialPage)?.classList.contains("page")
  ? initialPage : "home");
   
