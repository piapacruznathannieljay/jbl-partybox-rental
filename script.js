// ========================================
// JEPOY'S JBL PARTYBOX
// GPS + DELIVERY CALCULATOR
// ========================================

const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;


// Calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}


// Delivery fee
function calculateDeliveryFee(km) {

  // FREE within 5 km
  if (km <= 5) {
    return 0;
  }

  // ₱100 after 5 km
  // + ₱50 for every additional 3 km
  return 100 + Math.max(
    0,
    Math.ceil((km - 8) / 3)
  ) * 50;
}


let customerGPS = null;


// Get customer's GPS
function getCustomerLocation() {

  const result =
    document.getElementById("result");

  if (!navigator.geolocation) {

    result.textContent =
      "Your browser does not support GPS.";

    return;

  }

  result.textContent =
    "📍 Getting your GPS location...";

  navigator.geolocation.getCurrentPosition(

    function(position) {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;


      customerGPS = {
        lat: lat,
        lng: lng
      };


      // Calculate distance
      const distance =
        calculateDistance(
          BUSINESS_LAT,
          BUSINESS_LNG,
          lat,
          lng
        );


      const fee =
        calculateDeliveryFee(distance);


      // Google Maps location link
      const mapsLink =
        "https://www.google.com/maps?q=" +
        lat +
        "," +
        lng;


      // Show result
      result.innerHTML =

        "📍 Distance: <strong>" +
        distance.toFixed(2) +
        " km</strong><br>" +

        "🚚 Delivery: <strong>" +
        (fee === 0
          ? "FREE"
          : "₱" + fee.toLocaleString()) +
        "</strong><br><br>" +

        "🗺️ <a href=\"" +
        mapsLink +
        "\" target=\"_blank\">" +
        "Open Customer Location</a>";


      // Update booking form
      const distanceElement =
        document.getElementById("distance");

      const feeElement =
        document.getElementById("fee");


      if (distanceElement) {

        distanceElement.textContent =
          distance.toFixed(2) + " km";

      }


      if (feeElement) {

        feeElement.textContent =
          fee === 0
            ? "FREE"
            : "₱" + fee.toLocaleString();

      }

    },


    function(error) {

      if (error.code === 1) {

        result.textContent =
          "❌ Location permission denied. Please allow location access.";

      } else {

        result.textContent =
          "❌ Unable to get GPS location. Please turn on Location and try again.";

      }

    },


    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );
}


// Location buttons
const locationButton =
  document.getElementById("locationBtn");

if (locationButton) {

  locationButton.addEventListener(
    "click",
    getCustomerLocation
  );

}


const calculateButton =
  document.getElementById("calc");

if (calculateButton) {

  calculateButton.addEventListener(
    "click",
    getCustomerLocation
  );

}


// Booking form
const bookingForm =
  document.getElementById("bookingForm");


if (bookingForm) {

  bookingForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      if (!customerGPS) {

        alert(
          "Please tap 'Use My Current Location' first."
        );

        return;

      }


      const name =
        document.getElementById("name").value;

      const phone =
        document.getElementById("phone").value;

      const packageName =
        document.getElementById("package").value;

      const date =
        document.getElementById("date").value;

      const address =
        document.getElementById("address").value;


      const distance =
        document.getElementById("distance").textContent;

      const fee =
        document.getElementById("fee").textContent;


      // Customer's Google Maps GPS link
      const customerMapsLink =
        "https://www.google.com/maps?q=" +
        customerGPS.lat +
        "," +
        customerGPS.lng;


      const message =

        "Hello JEPOY'S JBL PARTYBOX!" +
        "\n\n" +

        "I would like to book a rental." +
        "\n\n" +

        "Name: " + name +
        "\n" +

        "Contact: " + phone +
        "\n" +

        "Package: " + packageName +
        "\n" +

        "Date: " + date +
        "\n" +

        "Delivery Address: " + address +
        "\n\n" +

        "Distance: " + distance +
        "\n" +

        "Delivery Fee: " + fee +
        "\n\n" +

        "📍 CUSTOMER GPS LOCATION:" +
        "\n" +

        customerMapsLink;


      const messengerURL =
        "https://m.me/1218332498024792?text=" +
        encodeURIComponent(message);


      window.open(
        messengerURL,
        "_blank"
      );

    }

  );

}
