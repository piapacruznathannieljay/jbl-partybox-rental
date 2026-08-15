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

document.getElementById("date").min = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

document.getElementById("year").textContent = today.getFullYear();

document.querySelectorAll("[data-package]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("package").value = btn.dataset.package;
  });
});

/*
  BUSINESS LOCATION
  X6QF+QR6 / supplied Google Maps location

  Delivery:
  0-5 km = free
  every 6 km = ₱100
  Every additional 3 km or part of 3 km = +₱50
*/

const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;

function deliveryFee(distanceKm) {
  if (distanceKm <= 5) {
    return 100;
  }

  return 100 + Math.ceil((distanceKm - 5) / 3) * 50;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

let deliveryInfo = null;

function showDelivery(distance) {
  const fee = deliveryFee(distance);
  const rounded = Math.round(distance * 10) / 10;

  const result = document.getElementById("deliveryResult");

  result.innerHTML =
    `Estimated distance: <strong>${rounded} km</strong><br>` +
    `Delivery fee: <strong>₱${fee.toLocaleString()}</strong><br>` +
    `<small>Calculated from the business location using straight-line distance. Final fee can be confirmed before booking.</small>`;

  result.classList.add("show");

  deliveryInfo = {
    distanceKm: rounded,
    fee: fee
  };
}

document.getElementById("useLocation").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");

  if (!navigator.geolocation) {
    status.textContent =
      "Your browser does not support location services.";
    return;
  }

  status.textContent = "Getting your location…";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const customerLat = position.coords.latitude;
      const customerLng = position.coords.longitude;

      const distance = haversineKm(
        BUSINESS_LAT,
        BUSINESS_LNG,
        customerLat,
        customerLng
      );

      showDelivery(distance);

      status.textContent =
        "Location received. Delivery fee calculated.";
    },
    () => {
      status.textContent =
        "Location access was denied or unavailable. Please allow location access and try again.";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
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

  const delivery = deliveryInfo
    ? `Estimated distance: ${deliveryInfo.distanceKm} km\nDelivery fee: ₱${deliveryInfo.fee.toLocaleString()}`
    : "Delivery fee: To be confirmed";

  const message =
    `Hi! I would like to book your JBL PartyBox rental.\n\n` +
    `Name: ${name}\n` +
    `Package: ${pkg}\n` +
    `Date: ${date}\n` +
    `Duration: ${hours}\n` +
    `Location: ${location}\n` +
    `${delivery}\n` +
    `Contact: ${contact}\n\n` +
    `Please confirm availability and the final delivery fee. Thank you!`;

  window.open(
    "https://m.me/1218332498024792?text=" +
      encodeURIComponent(message),
    "_blank"
  );
});
