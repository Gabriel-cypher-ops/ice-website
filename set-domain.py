#!/usr/bin/env python3
"""Usage: python3 scripts/set-domain.py example.com
Adds canonical, og:url and og:image to index.html, writes sitemap.xml from the
template and enables the Sitemap line in robots.txt. Safe to re-run."""
import re, sys, os
if len(sys.argv) != 2 or not re.fullmatch(r"[a-z0-9.-]+\.[a-z]{2,}", sys.argv[1].lower()):
    sys.exit("Usage: python3 scripts/set-domain.py example.com")
d = sys.argv[1].lower(); base = "https://" + d + "/"
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(root, "index.html"); s = open(p, encoding="utf-8").read()
s = re.sub(r'<link rel="canonical"[^>]*>\n?|<meta property="og:(url|image)"[^>]*>\n?', '', s)
tags = ('<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n'
        '<meta property="og:image" content="%sice-product.jpg">\n') % (base, base, base)
s, n = re.subn(r'(<!-- LAUNCH TODO:[^>]*-->\n?)', lambda m: tags, s, count=1)
if n == 0:
    s = s.replace('<meta name="twitter:card"', tags + '<meta name="twitter:card"', 1)
open(p, "w", encoding="utf-8").write(s)
t = open(os.path.join(root, "sitemap.template.xml"), encoding="utf-8").read()
t = re.sub(r'<!--.*?-->\n?', '', t, flags=re.S).replace("YOUR-DOMAIN", d)
open(os.path.join(root, "sitemap.xml"), "w", encoding="utf-8").write(t)
r = os.path.join(root, "robots.txt")
open(r, "w").write("User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n" % base)
print("Done for", d)
