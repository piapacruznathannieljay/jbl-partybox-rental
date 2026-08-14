const nav = document.getElementById("nav");

document.querySelector(".menu-toggle").addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const today = new Date();

const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
)
  .toISOString()
  .split("T")[0];

document.getElementById("date").min = localToday;

document.getElementById("year").textContent = today.getFullYear();

document.querySelectorAll("[data-package]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("package").value = btn.dataset.package;
  });
});

document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const pkg = document.getElementById("package").value;
  const date = document.getElementById("date").value;
  const hours = document.getElementById("hours").value;
  const location = document.getElementById("location").value.trim();
  const contact = document.getElementById("contact").value.trim();

  const message =
    `Hi! I would like to book your JBL PartyBox rental.\n\n` +
    `Name: ${name}\n` +
    `Package: ${pkg}\n` +
    `Date: ${date}\n` +
    `Duration: ${hours}\n` +
    `Location: ${location}\n` +
    `Contact: ${contact}\n\n` +
    `Please confirm availability. Thank you!`;

  const messengerURL = "https://m.me/1218332498024792";

  const encodedMessage = encodeURIComponent(message);

  window.open(
    messengerURL + "?text=" + encodedMessage,
    "_blank"
  );
});
