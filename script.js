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

/* DELIVERY SETTINGS
   0–5 km = ₱100
   Every additional 3 km = +₱50
*/

const BUSINESS_LAT = null;
const BUSINESS_LNG = null;

function calculateDeliveryFee(distanceKm) {
  if (distanceKm <= 5) {
    return 100;
  }

  return 100 + Math.ceil((distanceKm - 5) / 3) * 50;
}

function showDeliveryResult(distanceKm) {
  const result = document.getElementById("deliveryResult");

  const roundedDistance = Math.round(distanceKm * 10) / 10;
  const fee = calculateDeliveryFee(distanceKm);

  result.innerHTML =
    `<strong>Estimated distance: ${roundedDistance} km</strong><br>` +
    `Estimated delivery fee: <strong>₱${fee.toLocaleString()}</strong><br>` +
    `<small>Final delivery fee will be confirmed before booking.</small>`;

  result.classList.add("show");

  return {
    distanceKm: roundedDistance,
    fee: fee
  };
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

document.getElementById("useLocation").addEventListener("click", () => {

  const status = document.getElementById("locationStatus");

  if (BUSINESS_LAT === null || BUSINESS_LNG === null) {
    status.textContent =
      "Business location coordinates still need to be set.";
    return;
  }

  if (!navigator.geolocation) {
    status.textContent =
      "Location services are not supported by this browser.";
    return;
  }

  status.textContent = "Getting your location...";

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

      deliveryInfo = showDeliveryResult(distance);

      status.textContent =
        "Your location was used to estimate the delivery fee.";
    },

    () => {
      status.textContent =
        "Location access was not allowed. Please contact us to confirm the delivery fee.";
    },

    {
      enableHighAccuracy: true,
      timeout: 10000
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

  const deliveryText = deliveryInfo
    ? `Estimated distance: ${deliveryInfo.distanceKm} km\nDelivery fee: ₱${deliveryInfo.fee.toLocaleString()}`
    : "Delivery fee: To be confirmed";

  const message =
    `Hi! I would like to book your JBL PartyBox rental.\n\n` +
    `Name: ${name}\n` +
    `Package: ${pkg}\n` +
    `Date: ${date}\n` +
    `Duration: ${hours}\n` +
    `Location: ${location}\n` +
    `${deliveryText}\n` +
    `Contact: ${contact}\n\n` +
    `Please confirm availability and the final delivery fee. Thank you!`;

  const messengerURL =
    "https://m.me/1218332498024792";

  window.open(
    messengerURL + "?text=" + encodeURIComponent(message),
    "_blank"
  );
});
