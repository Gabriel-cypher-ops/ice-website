/* Mobile menu, store location section and "Find ice near me". No tracking, no storage. */
(function () {
  "use strict";
  var cfg = window.ICE_CONFIG;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("menuBtn"), links = $("navlinks");
  if (menuBtn && links) {
    var setMenu = function (open) {
      links.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuBtn.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  if (!cfg) return; // location features need the config file

  var hasCoords = cfg.coordsConfirmed === true && typeof cfg.lat === "number" && typeof cfg.lng === "number";
  var destination = hasCoords ? cfg.lat + "," + cfg.lng : cfg.mapsQuery;

  function dirUrl(origin) {
    var u = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination);
    if (origin) u += "&origin=" + encodeURIComponent(origin);
    return u;
  }

  /* ---------- Fill store details from config ---------- */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "name") el.textContent = cfg.name;
    if (k === "address") el.textContent = cfg.addressLines.join(", ");
    if (k === "hours" && Array.isArray(cfg.hours) && cfg.hours.length) {
      el.textContent = "";
      cfg.hours.forEach(function (line, i) {
        if (i) el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(line));
      });
    }
    if (k === "coords" && hasCoords) {
      el.textContent = cfg.lat.toFixed(6) + ", " + cfg.lng.toFixed(6);
      $("coordsRow").hidden = false;
    }
  });
  var dirBtn = $("dirBtn"), mapBtn = $("mapBtn"), frame = $("mapFrame");
  if (dirBtn) dirBtn.href = dirUrl();
  if (mapBtn) mapBtn.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destination);
  if (frame) frame.src = "https://www.google.com/maps?q=" + encodeURIComponent(destination) + "&output=embed";

  /* ---------- Find ice near me ---------- */
  var result = $("nearResult"), locateBtn = $("locateBtn"), form = $("manualForm"), input = $("manualInput");

  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function show(text, linkHref, linkLabel) {
    result.hidden = false;
    result.textContent = "";
    var p = document.createElement("div");
    p.textContent = text;
    result.appendChild(p);
    if (linkHref) {
      var a = document.createElement("a");
      a.className = "btn btn-wa";
      a.href = linkHref;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = linkLabel || "Get directions";
      result.appendChild(a);
    }
  }

  var addr = cfg.addressLines.join(", ");

  if (locateBtn) locateBtn.addEventListener("click", function () {
    if (!("geolocation" in navigator)) {
      show("Your browser can't share its location. Enter your suburb or town below instead.");
      return;
    }
    if (window.isSecureContext === false) {
      show("Location sharing needs a secure (https) connection. Enter your suburb or town below instead.");
      return;
    }
    locateBtn.disabled = true;
    show("Waiting for your browser to share your location…");
    navigator.geolocation.getCurrentPosition(function (pos) {
      locateBtn.disabled = false;
      var lat = pos.coords.latitude, lng = pos.coords.longitude;
      if (hasCoords) {
        var km = haversineKm(lat, lng, cfg.lat, cfg.lng);
        var dist = km < 1 ? "less than 1 km" : "about " + (km < 10 ? km.toFixed(1) : Math.round(km)) + " km";
        show(cfg.name + ", " + addr + ". You are " + dist + " away (straight line).", dirUrl(lat + "," + lng));
      } else {
        show(cfg.name + ", " + addr + ". Open directions to see the route and distance from where you are.", dirUrl());
      }
      // Coordinates are not kept; they go out of scope here.
    }, function (err) {
      locateBtn.disabled = false;
      var msg = err.code === 1
        ? "No problem, we didn't get your location. Enter your suburb or town below, or open directions directly."
        : err.code === 3
          ? "Finding your location took too long. Try again, or enter your suburb or town below."
          : "We couldn't work out your location. Enter your suburb or town below instead.";
      show(msg, dirUrl(), "Open directions to the store");
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });

  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var place = input.value.trim();
    if (place.length < 2) {
      show("Please type your suburb or town first.");
      input.focus();
      return;
    }
    show("Route from " + place + " to " + cfg.name + ".", dirUrl(place + ", South Africa"), "Open route in Google Maps");
  });
})();
