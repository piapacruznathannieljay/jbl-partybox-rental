// ========================================
// JEPOY'S JBL PARTYBOX
// AUTOMATIC DELIVERY CALCULATOR
// ========================================

// Your business location
// Supplied Google Maps location
const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;


// ========================================
// CALCULATE DISTANCE
// ========================================

function calculateDistance(lat1, lon1, lat2, lon2) {

  const earthRadius = 6371;

  const degreesToRadians = function (degrees) {
    return degrees * Math.PI / 180;
  };

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
    Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ========================================
// DELIVERY FEE
//
// 0–5 km = FREE
// Over 5 km = ₱100
// Every additional 3 km = +₱50
//
// Examples:
//
// 5 km  = FREE
// 6 km  = ₱100
// 8 km  = ₱100
// 9 km  = ₱150
// 11 km = ₱150
// 12 km = ₱200
// ========================================

function calculateDeliveryFee(distanceKm) {

  if (distanceKm <= 5) {
    return 0;
  }

  return 100 +
    Math.max(
      0,
      Math.ceil((distanceKm - 8) / 3)
    ) * 50;
}


// ========================================
// DISPLAY DELIVERY RESULT
// ========================================

function displayDelivery(distanceKm) {

  const fee = calculateDeliveryFee(distanceKm);

  const distanceElement =
    document.getElementById("distance");

  const feeElement =
    document.getElementById("fee");

  const resultElement =
    document.getElementById("result");


  if (distanceElement) {

    distanceElement.textContent =
      distanceKm.toFixed(2) + " km";

  }


  if (feeElement) {

    if (fee === 0) {

      feeElement.textContent =
        "FREE";

    } else {

      feeElement.textContent =
        "₱" + fee.toLocaleString();

    }

  }


  if (resultElement) {

    if (fee === 0) {

      resultElement.innerHTML =
        "📍 " +
        distanceKm.toFixed(2) +
        " km away — <strong>FREE DELIVERY</strong>";

    } else {

      resultElement.innerHTML =
        "📍 " +
        distanceKm.toFixed(2) +
        " km away — Delivery fee: <strong>₱" +
        fee.toLocaleString() +
        "</strong>";

    }

  }

}


// ========================================
// GET CURRENT LOCATION
// ========================================

function getCurrentLocation() {

  const result =
    document.getElementById("result");


  if (!navigator.geolocation) {

    if (result) {

      result.textContent =
        "Your browser does not support location services.";

    }

    return;
  }


  if (result) {

    result.textContent =
      "📍 Getting your current location...";

  }


  navigator.geolocation.getCurrentPosition(

    function (position) {

      const customerLatitude =
        position.coords.latitude;

      const customerLongitude =
        position.coords.longitude;


      const distanceKm =
        calculateDistance(
          BUSINESS_LAT,
          BUSINESS_LNG,
          customerLatitude,
          customerLongitude
        );


      displayDelivery(distanceKm);


      const address =
        document.getElementById("address");


      if (address) {

        address.value =
          "Current GPS location selected. Please add your complete address.";

      }

    },


    function (error) {

      if (result) {

        if (error.code === 1) {

          result.textContent =
            "❌ Location permission was denied. Please allow location access in your browser settings.";

        } else {

          result.textContent =
            "❌ Could not get your location. Please turn on GPS/location and try again.";

        }

      }

    },


    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    }

  );

}


// ========================================
// LOCATION BUTTON
// ========================================

const locationButton =
  document.getElementById("locationBtn");


if (locationButton) {

  locationButton.addEventListener(
    "click",
    getCurrentLocation
  );

}


// ========================================
// CALCULATE DELIVERY BUTTON
// ========================================

const calculateButton =
  document.getElementById("calc");


if (calculateButton) {

  calculateButton.addEventListener(
    "click",
    getCurrentLocation
  );

}


// ========================================
// BOOKING FORM
// ========================================

const bookingForm =
  document.getElementById("bookingForm");


if (bookingForm) {

  bookingForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const distance =
        document.getElementById("distance");


      if (
        !distance ||
        distance.textContent === "Not calculated"
      ) {

        alert(
          "Please calculate your delivery fee first."
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

      const deliveryDistance =
        document.getElementById("distance").textContent;

      const deliveryFee =
        document.getElementById("fee").textContent;


      const message =
        "Hello JEPOY'S JBL PARTYBOX!\n\n" +

        "I would like to book a rental.\n\n" +

        "Name: " + name + "\n" +

        "Contact: " + phone + "\n" +

        "Package: " + packageName + "\n" +

        "Date: " + date + "\n" +

        "Delivery Address: " + address + "\n\n" +

        "Delivery Distance: " +
        deliveryDistance + "\n" +

        "Delivery Fee: " +
        deliveryFee;


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
