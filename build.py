# builds the installable app (docs/) from index.html, the same file published on claude.ai
# run: python build.py   (ci fails if docs/ is out of date)
import hashlib, re, shutil
from pathlib import Path

root = Path(__file__).parent
src = (root / "index.html").read_text(encoding="utf-8")
out = root / "docs"

# google fonts aren't available offline, so the app ships its own copies
body = re.sub(r'<link rel="(preconnect|stylesheet)" href="https://fonts\.g[^"]*"[^>]*>\n?', "", src)
title = re.search(r"<title>(.*?)</title>", body).group(1)
body = body.replace(f"<title>{title}</title>\n", "", 1)
fonts = """<style>
@font-face{font-family:"Amiri";font-weight:400;font-display:swap;src:url(fonts/amiri-arabic-400-normal.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
@font-face{font-family:"Amiri";font-weight:700;font-display:swap;src:url(fonts/amiri-arabic-700-normal.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
@font-face{font-family:"Readex Pro";font-weight:400;font-display:swap;src:url(fonts/readex-pro-latin-400-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Readex Pro";font-weight:400;font-display:swap;src:url(fonts/readex-pro-latin-ext-400-normal.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Readex Pro";font-weight:500;font-display:swap;src:url(fonts/readex-pro-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:"Readex Pro";font-weight:600;font-display:swap;src:url(fonts/readex-pro-latin-600-normal.woff2) format("woff2")}
</style>"""
head = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="Learn to speak Gulf Arabic from zero.">
<meta name="theme-color" content="#0f5f5a" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1513" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Harf">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{fonts}
</head>
<body>
"""
sw = """<script>
// installed-app extras: offline support and asking the browser not to clear progress
window.HARF_PWA=true;
if("serviceWorker" in navigator) addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
if(navigator.storage&&navigator.storage.persist) navigator.storage.persist().catch(()=>{});
</script>
"""
html = head + body.strip() + "\n" + sw + "</body>\n</html>\n"
build = hashlib.sha256(html.encode()).hexdigest()[:10]

if out.exists(): shutil.rmtree(out)
shutil.copytree(root / "pwa", out)
(out / "sw.js").write_text((root / "pwa" / "sw.js").read_text().replace("__BUILD__", build))
(out / "index.html").write_text(html, encoding="utf-8")
(out / ".nojekyll").write_text("")
print(f"built docs/ ({build})")
