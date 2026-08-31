/* ============ ANALÍTICAS BÁSICAS DEL BLOG (byluis.design) ============
   Envía un hit al backend admin (portfolio-luis-src.onrender.com/api/track)
   con el slug del artículo. Exclusión de la visita del dueño:
   - localStorage 'byluis_no_track' = '1'  (Luis lo activa visitando con ?notrack=1)
   - El server además ignora IPs configuradas en IGNORE_IPS (Render env).
   Fire-and-forget: nunca bloquea ni falla visible si el backend duerme. */
(function () {
  try {
    if (localStorage.getItem("byluis_no_track") === "1") return;
    // ?notrack=1 → activa la exclusión local y sigue sin contar (Luis: visita una vez así)
    if (new URLSearchParams(location.search).get("notrack") === "1") {
      localStorage.setItem("byluis_no_track", "1");
      return;
    }
    var slug = (document.querySelector('meta[name="article:slug"]') || {}).content || location.pathname;
    var endpoint = "https://portfolio-luis-src.onrender.com/api/track";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint + "?slug=" + encodeURIComponent(slug), "");
    } else {
      fetch(endpoint + "?slug=" + encodeURIComponent(slug), {
        method: "POST",
        keepalive: true,
        mode: "cors",
        headers: { "Content-Type": "text/plain" },
        body: "1",
      }).catch(function () {});
    }
  } catch (e) {}
})();
