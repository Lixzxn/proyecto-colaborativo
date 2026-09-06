const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => menu.classList.toggle("open"));

document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => menu.classList.remove("open"));
});

document.getElementById("year").textContent = new Date().getFullYear();
