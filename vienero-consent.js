/* VIENERO: Einwilligung fuer Google Ads Messung mit Consent Mode v2. Ohne Zustimmung keine Cookies. */
(function () {
  var AW = 'AW-18506650716';
  var CONV = 'AW-18506650716/FYBXCNr-g5kdENyo1PhE';
  var KEY = 'vienero_consent_v1';
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  /* Einwilligungsmodus von Google (Consent Mode v2): Standard ist "abgelehnt".
     Ohne Zustimmung setzt Google keine Cookies und bekommt nur einfache Signale ohne Kennungen. */
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);
  function erlauben() { gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted' }); }
  if (get() === 'yes') erlauben();

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', AW);
  if (location.pathname.indexOf('/reservierung') !== -1) gtag('event', 'conversion', { send_to: CONV });

  /* Klicks auf die Telefonnummer zaehlen */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) gtag('event', 'conversion', { send_to: CONV });
  }, true);

  var T = en ? {
    text: 'We use Google Ads to see which of our ads bring guests to VIENERO. With your consent we set cookies for this. Without it, Google only receives simple signals without cookies. The website works the same either way.',
    yes: 'Accept', no: 'Decline', more: 'Privacy', href: 'datenschutz.html'
  } : {
    text: 'Wir nutzen Google Ads, um zu sehen, welche unserer Anzeigen Gäste ins VIENERO bringen. Mit deiner Zustimmung setzen wir dafür Cookies, ohne bekommt Google nur einfache Signale ohne Cookies. Die Seite funktioniert in beiden Fällen genauso.',
    yes: 'Akzeptieren', no: 'Ablehnen', more: 'Datenschutz', href: 'datenschutz.html'
  };

  function banner() {
    if (document.getElementById('vnConsent')) return;
    var css = document.createElement('style');
    css.textContent =
      '#vnConsent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#2F3133;color:#F8F5EE;border-radius:14px;padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.25);' +
      'font:14px/1.5 Inter,system-ui,sans-serif}' +
      '#vnConsent p{margin:0 0 12px}#vnConsent a{color:#C8A76A}' +
      '#vnConsent .r{display:flex;gap:10px;flex-wrap:wrap;align-items:center}' +
      '#vnConsent button{flex:1 1 120px;border:0;border-radius:999px;padding:10px 16px;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}' +
      '#vnConsent .y{background:#C8A76A;color:#2F3133}#vnConsent .n{background:transparent;color:#F8F5EE;border:1px solid #AEB2A0}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.id = 'vnConsent';
    d.setAttribute('role', 'dialog');
    d.innerHTML = '<p>' + T.text + ' <a href="' + T.href + '">' + T.more + '</a></p>' +
      '<div class="r"><button class="n" type="button">' + T.no + '</button><button class="y" type="button">' + T.yes + '</button></div>';
    d.querySelector('.y').onclick = function () { set('yes'); d.remove(); erlauben(); };
    d.querySelector('.n').onclick = function () { set('no'); d.remove(); };
    document.body.appendChild(d);
  }

  /* Fuer die Datenschutzseite: Auswahl neu treffen */
  window.vieneroConsentReset = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };

  var c = get();
  if (c !== 'yes' && c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }

  /* ===== Reservieren-Leiste: am Handy unten fix, am Computer als Knopf rechts unten ===== */
  function leiste() {
    var p = location.pathname;
    if (/reservierung|impressum|datenschutz|presse|service|aktion|preopening/.test(p)) return;
    if (document.getElementById('vnLeiste')) return;
    var L = en ? {
      res: 'Book a table', tel: 'Call', info: '★ 4.4 on Google · more than 1,500 reviews'
    } : {
      res: 'Tisch reservieren', tel: 'Anrufen', info: '★ 4,4 auf Google · über 1.500 Bewertungen'
    };
    var css = document.createElement('style');
    css.textContent =
      '#vnLeiste{position:fixed;left:0;right:0;bottom:0;z-index:9000;background:rgba(47,49,51,.97);color:#F8F5EE;' +
      'padding:8px 12px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(0,0,0,.18);' +
      'font:12px/1.4 Inter,system-ui,sans-serif;transform:translateY(110%);transition:transform .35s ease}' +
      '#vnLeiste.zeigen{transform:none}' +
      '#vnLeiste .i{text-align:center;color:#C8A76A;font-size:11.5px;letter-spacing:.3px;margin-bottom:7px}' +
      '#vnLeiste .r{display:flex;gap:8px;max-width:520px;margin:0 auto}' +
      '#vnLeiste a{flex:1;display:block;text-align:center;text-decoration:none;border-radius:999px;padding:12px 10px;' +
      'font:600 13px Inter,system-ui,sans-serif;letter-spacing:.4px}' +
      '#vnLeiste .y{background:#C8A76A;color:#2F3133;flex:1.6}' +
      '#vnLeiste .n{border:1px solid #AEB2A0;color:#F8F5EE}' +
      'body.vnPlatz{padding-bottom:96px}' +
      '@media (min-width:761px){#vnLeiste{left:auto;right:22px;bottom:22px;border-radius:18px;padding:12px 14px;max-width:340px}' +
      '#vnLeiste .r{gap:8px}body.vnPlatz{padding-bottom:0}}';
    document.head.appendChild(css);
    var anker = document.getElementById('reservieren') || document.getElementById('reserve');
    var ziel = anker ? '#' + anker.id : 'reservierung.html';
    var d = document.createElement('div');
    d.id = 'vnLeiste';
    d.innerHTML = '<div class="i">' + L.info + '</div><div class="r">' +
      '<a class="y" href="' + ziel + '">' + L.res + '</a>' +
      '<a class="n" href="tel:+4319137005">' + L.tel + '</a></div>';
    document.body.appendChild(d);
    document.body.classList.add('vnPlatz');
    var start = (p === '/' || /index\.html$|\/en\.html$/.test(p)) ? window.innerHeight * 0.7 : 160;
    function pruefen() {
      var bannerOffen = !!document.getElementById('vnConsent');
      var y = Math.max(window.scrollY || 0, document.body.scrollTop || 0, document.documentElement.scrollTop || 0);
      if (y > start && !bannerOffen) d.classList.add('zeigen');
      else d.classList.remove('zeigen');
    }
    document.addEventListener('scroll', pruefen, { passive: true, capture: true });
    document.addEventListener('click', function () { setTimeout(pruefen, 50); });
    pruefen();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', leiste);
  else leiste();
})();
