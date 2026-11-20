/*
 * Central business configuration.
 * Edit this file to change the store details used by the location section,
 * the "Find ice near me" feature and the Google Maps links.
 *
 * lat / lng : candidate GPS coordinates (from City of uMhlathuze property
 *             records). NOT yet checked against the actual shop.
 * coordsConfirmed : keep false until someone has stood at the shop (or checked
 *             the pin in Google Maps) and confirmed lat/lng. While false, the
 *             site links to Google Maps by street address, skips the distance
 *             calculation and does not show the coordinates.
 * hours     : leave as null until the real opening hours are confirmed,
 *             otherwise provide an array of lines, e.g.
 *             ["Mon-Fri: 08:00 - 17:00", "Sat: 08:00 - 13:00"]
 */
window.ICE_CONFIG = {
  name: "Ice for Sale",
  addressLines: ["1214 Umviyo Street", "Enseleni, Ward 7", "Richards Bay"],
  // Used to build Google Maps links when coordinates are not set.
  mapsQuery: "1214 Umviyo Street, Enseleni, South Africa",
  lat: -28.6623648,
  lng: 32.0264242,
  coordsConfirmed: false,
  hours: null
};
