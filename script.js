/* =========================================================
   JEPOY'S JBL PARTYBOX
   DELIVERY CALCULATOR + BOOKING
   ========================================================= */


/* =========================================================
   BUSINESS LOCATION
   =========================================================

   IMPORTANT:

   Put the exact latitude and longitude of your rental location
   here.

   You previously gave:
   X6QF+QR6 Bugallon, Pangasinan

   The numbers below are examples only.

   Replace them with the exact coordinates of your location.
*/

const BUSINESS_LATITUDE = 15.928000;
const BUSINESS_LONGITUDE = 120.187000;


/* =========================================================
   DELIVERY RULES
   ========================================================= */

const FREE_DELIVERY_KM = 5;

const BASE_DELIVERY_FEE = 100;

const ADDITIONAL_KM = 3;

const ADDITIONAL_FEE = 50;


/* =========================================================
   MESSENGER
   ========================================================= */

const MESSENGER_LINK =
    "https://m.me/1218332498024792";


/* =========================================================
   VARIABLES
   ========================================================= */

let selectedPackage = "";

let selectedPrice = 0;

let calculatedDistance = null;

let calculatedDeliveryFee = null;


/* =========================================================
   PAGE ELEMENTS
   ========================================================= */

const packageButtons =
    document.querySelectorAll(".select-package");

const selectedPackageInput =
    document.getElementById("selectedPackage");

const durationInput =
    document.getElementById("duration");

const mapsLinkInput =
    document.getElementById("mapsLink");

const latitudeInput =
    document.getElementById("latitude");

const longitudeInput =
    document.getElementById("longitude");

const distanceOutput =
    document.getElementById("distance");

const deliveryFeeOutput =
    document.getElementById("deliveryFee");

const summaryPackage =
    document.getElementById("summaryPackage");

const summaryDuration =
    document.getElementById("summaryDuration");

const summaryDelivery =
    document.getElementById("summaryDelivery");

const calculateDeliveryButton =
    document.getElementById("calculateDelivery");

const openMapButton =
    document.getElementById("openMapButton");

const bookButton =
    document.getElementById("bookButton");


/* =========================================================
   SELECT PACKAGE
   ========================================================= */

packageButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedPackage =
            button.dataset.package;

        selectedPrice =
            Number(button.dataset.price);


        selectedPackageInput.value =
            selectedPackage;


        summaryPackage.textContent =
            selectedPackage;


        summaryDuration.textContent =
            durationInput.value + " Hours";


        document
            .getElementById("booking")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================================================
   DURATION CHANGE
   ========================================================= */

durationInput.addEventListener(
    "change",
    function() {

        summaryDuration.textContent =
            durationInput.value + " Hours";

    }
);


/* =========================================================
   EXTRACT COORDINATES FROM GOOGLE MAPS LINK
   ========================================================= */

function extractCoordinates(url) {

    if (!url) {
        return null;
    }


    /*
       Pattern:

       @15.12345,120.12345
    */

    let match =
        url.match(
            /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        );


    if (match) {

        return {
            latitude: Number(match[1]),
            longitude: Number(match[2])
        };

    }


    /*
       Pattern:

       ?query=15.12345,120.12345
    */

    match =
        url.match(
            /[?&](?:query|q|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        );


    if (match) {

        return {
            latitude: Number(match[1]),
            longitude: Number(match[2])
        };

    }


    /*
       Pattern:

       /15.12345,120.12345
    */

    match =
        url.match(
            /\/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:[/?]|$)/
        );


    if (match) {

        return {
            latitude: Number(match[1]),
            longitude: Number(match[2])
        };

    }


    return null;

}


/* =========================================================
   HAVERSINE DISTANCE
   ========================================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;


    const latitudeDifference =
        toRadians(lat2 - lat1);

    const longitudeDifference =
        toRadians(lon2 - lon1);


    const a =
        Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2)
        +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


function toRadians(degrees) {

    return degrees *
        Math.PI /
        180;

}


/* =========================================================
   DELIVERY FEE CALCULATOR
   ========================================================= */

function calculateFee(distanceKm) {

    /*
       0–5 km = FREE
    */

    if (distanceKm <= FREE_DELIVERY_KM) {

        return 0;

    }


    /*
       Over 5 km = ₱100
    */

    let extraDistance =
        distanceKm -
        FREE_DELIVERY_KM;


    /*
       Every additional 3 km = ₱50

       Example:

       5.1–8 km = ₱100
       8.1–11 km = ₱150
       11.1–14 km = ₱200
    */

    let additionalBlocks =
        Math.ceil(
            extraDistance /
            ADDITIONAL_KM
        );


    return BASE_DELIVERY_FEE +
        (
            (additionalBlocks - 1) *
            ADDITIONAL_FEE
        );

}


/* =========================================================
   CALCULATE DELIVERY BUTTON
   ========================================================= */

calculateDeliveryButton.addEventListener(
    "click",
    function() {


        let latitude =
            Number(latitudeInput.value);

        let longitude =
            Number(longitudeInput.value);


        /*
           If coordinates were not manually entered,
           try to get them from the Google Maps URL.
        */

        if (
            !latitude ||
            !longitude
        ) {

            const coordinates =
                extractCoordinates(
                    mapsLinkInput.value.trim()
                );


            if (coordinates) {

                latitude =
                    coordinates.latitude;

                longitude =
                    coordinates.longitude;


                latitudeInput.value =
                    latitude;

                longitudeInput.value =
                    longitude;

            }

        }


        /*
           Check coordinates
        */

        if (
            !latitude ||
            !longitude ||
            isNaN(latitude) ||
            isNaN(longitude)
        ) {

            alert(
                "We couldn't read the coordinates from the Google Maps link.\n\n" +
                "Please enter the Latitude and Longitude of your pin."
            );

            return;

        }


        /*
           Calculate distance
        */

        calculatedDistance =
            calculateDistance(
                BUSINESS_LATITUDE,
                BUSINESS_LONGITUDE,
                latitude,
                longitude
            );


        /*
           Calculate delivery fee
        */

        calculatedDeliveryFee =
            calculateFee(
                calculatedDistance
            );


        /*
           Display distance
        */

        distanceOutput.textContent =
            calculatedDistance.toFixed(2) +
            " km";


        /*
           Display delivery fee
        */

        if (
            calculatedDeliveryFee === 0
        ) {

            deliveryFeeOutput.textContent =
                "FREE";

        } else {

            deliveryFeeOutput.textContent =
                "₱" +
                calculatedDeliveryFee;

        }


        /*
           Update summary
        */

        if (
            calculatedDeliveryFee === 0
        ) {

            summaryDelivery.textContent =
                "FREE (" +
                calculatedDistance.toFixed(2) +
                " km)";

        } else {

            summaryDelivery.textContent =
                "₱" +
                calculatedDeliveryFee +
                " (" +
                calculatedDistance.toFixed(2) +
                " km)";

        }

    }
);


/* =========================================================
   OPEN CUSTOMER GOOGLE MAPS LOCATION
   ========================================================= */

openMapButton.addEventListener(
    "click",
    function() {

        const link =
            mapsLinkInput.value.trim();


        if (!link) {

            alert(
                "Please paste the customer's Google Maps pin link first."
            );

            return;

        }


        window.open(
            link,
            "_blank"
        );

    }
);


/* =========================================================
   BOOK THROUGH MESSENGER
   ========================================================= */

bookButton.addEventListener(
    "click",
    function() {


        const customerName =
            document
                .getElementById("customerName")
                .value
                .trim();


        const customerPhone =
            document
                .getElementById("customerPhone")
                .value
                .trim();


        const duration =
            durationInput.value;


        const mapsLink =
            mapsLinkInput.value.trim();


        /*
           Check required fields
        */

        if (!selectedPackage) {

            alert(
                "Please select a package first."
            );

            return;

        }


        if (!customerName) {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (!customerPhone) {

            alert(
                "Please enter your contact number."
            );

            return;

        }


        if (!mapsLink) {

            alert(
                "Please provide your Google Maps delivery location."
            );

            return;

        }


        /*
           Delivery text
        */

        let deliveryText;


        if (
            calculatedDeliveryFee === null
        ) {

            deliveryText =
                "Please calculate delivery fee";

        } else if (
            calculatedDeliveryFee === 0
        ) {

            deliveryText =
                "FREE";

        } else {

            deliveryText =
                "₱" +
                calculatedDeliveryFee;

        }


        /*
           Create Messenger message
        */

        const message =
`Hello! I would like to book JEPOY'S JBL PARTYBOX.

Customer Name: ${customerName}

Contact Number: ${customerPhone}

Package: ${selectedPackage}

Duration: ${duration} Hours

Delivery Distance: ${
    calculatedDistance !== null
        ? calculatedDistance.toFixed(2) + " km"
        : "Not calculated"
}

Delivery Fee: ${deliveryText}

Google Maps Location:
${mapsLink}

Thank you!`;


        /*
           Open Messenger
        */

        const messengerUrl =
            MESSENGER_LINK +
            "?ref=" +
            encodeURIComponent(
                message
            );


        window.open(
            messengerUrl,
            "_blank"
        );

    }
);
