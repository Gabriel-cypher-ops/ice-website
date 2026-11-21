# Ice for Sale

Static one-page website for Ice for Sale (Enseleni, Richards Bay). No build step, no backend, no API keys.

## Structure

```
index.html            page, styles and the order calculator
js/config.js          store details: address, GPS coordinates, opening hours
js/site.js            mobile menu, store location, "Find ice near me"
scripts/set-domain.py  one-command domain setup (see below)
ice-product.jpg       product photo (keep next to index.html)
ice-stock.jpg         bulk photo (keep next to index.html)
robots.txt            crawler rules and sitemap location
sitemap.xml           sitemap for the current Netlify URL
netlify.toml          Netlify headers
```

## Before launch (required)

1. **Confirm the GPS pin.** `js/config.js` holds candidate coordinates from municipal property records with `coordsConfirmed: false`. Check them against the shop in Google Maps, correct if needed, then set `coordsConfirmed: true`. That switches on the distance feature and the coordinates display. Then add a `geo` block (GeoCoordinates) to the JSON-LD in `index.html`.
2. **Opening hours**: set `hours` in `js/config.js`, and add `openingHoursSpecification` to the JSON-LD block. Until then the site says to message on WhatsApp.
3. **Free Netlify URL**: canonical URL, social preview image, sitemap.xml and the Sitemap line in robots.txt are configured for https://ice-enseleni.netlify.app/. If the Netlify subdomain changes, update those URLs.
4. **Social links**: none are listed because none are confirmed. Add them (and `sameAs` in the JSON-LD) when they exist.
5. **Test the WhatsApp links** and confirm delivery fees.

## Local search

The site includes LocalBusiness JSON-LD, but code alone does not guarantee a Maps or local search ranking. Claim and verify a **Google Business Profile** for the Enseleni address, using the same name, address and phone numbers as the site.

## Deploy (Netlify)

Drag the project folder into https://app.netlify.com/drop, or connect the GitHub repo with publish directory `.` and no build command. Add the custom domain under Domain settings.

## Privacy

"Find ice near me" asks the browser for a one-off location, calculates in the browser, and stores or sends nothing.
