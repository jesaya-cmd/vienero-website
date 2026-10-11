/* VIENERO: Einwilligung fuer Google Ads Messung. Ohne Zustimmung wird nichts von Google Ads geladen. */
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

  var loaded = false;
  function loadAds() {
    if (loaded) return; loaded = true;
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', AW);
    if (location.pathname.indexOf('reservierung') !== -1) gtag('event', 'conversion', { send_to: CONV });
  }

  /* Reservierungsseite und Klicks auf die Telefonnummer zaehlen, nur wenn zugestimmt */
  document.addEventListener('click', function (ev) {
    if (!loaded) return;
    var a = ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) gtag('event', 'conversion', { send_to: CONV });
  }, true);

  var T = en ? {
    text: 'We use Google Ads cookies to see which of our ads bring guests to VIENERO. You can say no, the website works the same.',
    yes: 'Accept', no: 'Decline', more: 'Privacy', href: 'datenschutz.html'
  } : {
    text: 'Wir nutzen Cookies von Google Ads, um zu sehen, welche unserer Anzeigen Gäste ins VIENERO bringen. Du kannst ablehnen, die Seite funktioniert genauso.',
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
    d.querySelector('.y').onclick = function () { set('yes'); d.remove(); loadAds(); };
    d.querySelector('.n').onclick = function () { set('no'); d.remove(); };
    document.body.appendChild(d);
  }

  /* Fuer die Datenschutzseite: Auswahl neu treffen */
  window.vieneroConsentReset = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };

  var c = get();
  if (c === 'yes') loadAds();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }
})();
