const nav = document.getElementById("nav");
document
  .querySelector(".menu-toggle")
  .addEventListener("click", () => nav.classList.toggle("open"));
document
  .querySelectorAll("#nav a")
  .forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
document.getElementById("date").min = localToday;
document.getElementById("year").textContent = today.getFullYear();

document.querySelectorAll("[data-package]").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.getElementById("package").value = btn.dataset.package;
  })
);

// Business location: X6QF+QR6, Bañaga/Bugallon, Pangasinan.
// The Plus Code resolves to approximately these coordinates.
const BUSINESS_LAT = 15.9894375;
const BUSINESS_LNG = 120.2245625;

// Delivery rule: ₱100 for the first 5 km, then +₱50 for every additional 3 km (or part of 3 km).
function calculateDeliveryFee(distanceKm) {
  if (distanceKm <= 5) return 100;
  return 100 + Math.ceil((distanceKm - 5) / 3) * 50;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

let deliveryInfo = null;
const status = document.getElementById("locationStatus");
const result = document.getElementById("deliveryResult");

function showDeliveryResult(distanceKm) {
  const rounded = Math.round(distanceKm * 10) / 10;
  const fee = calculateDeliveryFee(distanceKm);
  result.innerHTML = `<strong>Estimated distance: ${rounded} km</strong><br>Delivery fee: <strong>₱${fee.toLocaleString()}</strong><br><small>Calculated from the rental location. Final fee can be confirmed before delivery.</small>`;
  result.classList.add("show");
  deliveryInfo = { distanceKm: rounded, fee };
}

document.getElementById("useLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    status.textContent = "Location services are not supported by this browser.";
    return;
  }
  status.textContent = "Getting your location… please allow location access.";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const distance = haversineKm(
        BUSINESS_LAT,
        BUSINESS_LNG,
        position.coords.latitude,
        position.coords.longitude
      );
      showDeliveryResult(distance);
      status.textContent = "Location selected and delivery fee calculated automatically.";
    },
    () => {
      status.textContent =
        "Location access was denied. Please allow location access and try again.";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
});

document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const pkg = document.getElementById("package").value;
  const date = document.getElementById("date").value;
  const hours = document.getElementById("hours").value;
  const location = document.getElementById("location").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const deliveryText = deliveryInfo
    ? `Estimated distance: ${ deliveryInfo.distanceKm } km\nDelivery fee: ₱${deliveryInfo.fee.toLocaleString()}`
    : "Delivery fee: To be confirmed (customer did not use automatic location calculation)";
  const message = `Hi! I would like to book your JBL PartyBox rental.\n\nName: ${name}\nPackage: ${pkg}\nDate: ${date}\nDuration: ${hours}\nLocation: ${location}\n${deliveryText}\nContact: ${contact}\n\nPlease confirm availability and the final delivery fee. Thank you!`;
  const messengerURL = "https://m.me/1218332498024792";
  window.open(messengerURL + "?text=" + encodeURIComponent(message), "_blank");
});
