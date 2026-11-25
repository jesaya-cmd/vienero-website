/* VIENERO: Einwilligung fuer Google Analytics und Google Ads Messung mit Consent Mode v2. Ohne Zustimmung keine Cookies. */
(function () {
  var AW = 'AW-18506650716';
  var GA = 'G-FJ2ZZ9SF1T'; /* Google Analytics 4, Property vienero.at */
  var CONV = 'AW-18506650716/FYBXCNr-g5kdENyo1PhE'; /* Seitenaufruf Reservierung (sekundaer) */
  var CONV_TEL = 'AW-18506650716/SwAgCLLTyK8dENyo1PhE'; /* Klick auf Telefonnummer (Website), Wert 15 */
  var KEY = 'vienero_consent_v3'; /* v3 seit 25.11.2026: ChatGPT Anzeigen (OpenAI) dazu, deshalb alle neu fragen */
  var OAI = 'BBYf3SVPXrhV1dn1iDSFQd'; /* OpenAI Ads Pixel, Datenquelle vienero.at Website */
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var lg = (document.documentElement.lang || 'de').toLowerCase().slice(0,2);

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  /* Einwilligungsmodus von Google (Consent Mode v2): Standard ist "abgelehnt".
     Ohne Zustimmung setzt Google keine Cookies und bekommt nur einfache Signale ohne Kennungen. */
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);
  /* OpenAI Ads Pixel (ChatGPT Anzeigen): nur mit Zustimmung laden, Reservierung auf der Danke-Seite zaehlen */
  function openai() {
    if (window.oaiq) return;
    !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f);}(window,document,'script','https://bzrcdn.openai.com/sdk/oaiq.min.js');
    window.oaiq('init', { pixelId: OAI });
    if (/danke-reservierung/.test(location.pathname)) window.oaiq('measure', 'appointment_scheduled', { type: 'customer_action' });
  }
  function erlauben() { gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', analytics_storage: 'granted' }); openai(); }
  if (get() === 'yes') erlauben();

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', AW);
  gtag('config', GA);
  if (/\/reservierung|\/book-a-table/.test(location.pathname)) gtag('event', 'conversion', { send_to: CONV });

  /* Datumsabhaengige Texte (z. B. neue Sonntagszeiten ab 3.1.2027) automatisch umstellen */
  function datumTexte() {
    var h;
    try { h = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vienna' })); } catch (e) { h = new Date(); }
    var heute = h.getFullYear() + '-' + ('0' + (h.getMonth() + 1)).slice(-2) + '-' + ('0' + h.getDate()).slice(-2);
    var a = document.querySelectorAll('[data-ab]');
    for (var i = 0; i < a.length; i++) if (heute >= a[i].getAttribute('data-ab')) a[i].innerHTML = a[i].getAttribute('data-neu');
    var b = document.querySelectorAll('[data-bis]');
    for (var j = 0; j < b.length; j++) if (heute >= b[j].getAttribute('data-bis')) b[j].style.display = 'none';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', datumTexte); else datumTexte();

  /* Klicks auf die Telefonnummer zaehlen */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) gtag('event', 'conversion', { send_to: CONV_TEL });
    /* Analytics: wichtige Klicks als eigene Ereignisse */
    if (h.indexOf('tel:') === 0) gtag('event', 'anruf_klick', { send_to: GA, seite: location.pathname });
    else if (/book\.stripe\.com/.test(h)) gtag('event', 'silvester_buchen_klick', { send_to: GA, seite: location.pathname });
    else if (/reservierung\.html|book-a-table\.html|thefork/.test(h)) gtag('event', 'reservieren_klick', { send_to: GA, seite: location.pathname });
    else if (/^mailto:/.test(h)) gtag('event', 'email_klick', { send_to: GA, seite: location.pathname });
  }, true);

  var TT = {
    en: {text: 'We use Google Analytics, Google Ads and ChatGPT ads (OpenAI) to see how our website is used and which ads bring guests to VIENERO. With your consent we set cookies for this. Without it, OpenAI receives nothing and Google only receives simple signals without cookies. With consent we also look up via ipapi.co roughly which city and internet provider you are visiting from, without storing your IP address. The website works the same either way.', yes: 'Accept', no: 'Decline', more: 'Privacy', href: 'datenschutz.html'},
    fr: {text: "Nous utilisons Google Analytics, Google Ads et les annonces ChatGPT (OpenAI) pour savoir comment notre site est utilisé et quelles annonces amènent nos clients chez VIENERO. Avec votre accord, nous déposons des cookies à cet effet. Sans accord, OpenAI ne reçoit rien et Google ne reçoit que des signaux simples, sans cookies. Avec votre accord, nous déterminons aussi via ipapi.co la ville et le fournisseur d’accès approximatifs, sans enregistrer votre adresse IP. Le site fonctionne de la même façon dans les deux cas.", yes: 'Accepter', no: 'Refuser', more: 'Confidentialité', href: 'datenschutz.html'},
    it: {text: 'Usiamo Google Analytics, Google Ads e gli annunci ChatGPT (OpenAI) per capire come viene usato il sito e quali annunci portano ospiti da VIENERO. Con il tuo consenso impostiamo dei cookie a questo scopo, senza consenso OpenAI non riceve nulla e Google riceve solo semplici segnali senza cookie. Con il consenso rileviamo anche tramite ipapi.co la città e il provider approssimativi, senza salvare il tuo indirizzo IP. Il sito funziona allo stesso modo in entrambi i casi.', yes: 'Accetta', no: 'Rifiuta', more: 'Privacy', href: 'datenschutz.html'},
    de: {text: 'Wir nutzen Google Analytics, Google Ads und Anzeigen in ChatGPT (OpenAI), um zu sehen, wie unsere Website genutzt wird und welche Anzeigen Gäste ins VIENERO bringen. Mit deiner Zustimmung setzen wir dafür Cookies, ohne bekommt OpenAI nichts und Google nur einfache Signale ohne Cookies. Mit Zustimmung ermitteln wir außerdem über ipapi.co ungefähr Stadt und Internetanbieter, ohne deine IP-Adresse zu speichern. Die Seite funktioniert in beiden Fällen genauso.', yes: 'Akzeptieren', no: 'Ablehnen', more: 'Datenschutz', href: 'datenschutz.html'}
  };
  var T = TT[lg] || TT.de;

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
    d.querySelector('.y').onclick = function () { set('yes'); d.remove(); erlauben(); if (window.vnOrt) window.vnOrt(); };
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
    if (/reservierung|book-a-table|impressum|datenschutz|presse|service|aktion|preopening/.test(p)) return;
    if (document.getElementById('vnLeiste')) return;
    var LL = {
      en: {res: 'Book a table', tel: 'Call', info: '★ 4.4 on Google · more than 1,500 reviews'},
      fr: {res: 'Réserver', tel: 'Appeler', info: '★ 4,4 sur Google · plus de 1 500 avis'},
      it: {res: 'Prenota', tel: 'Chiama', info: '★ 4,4 su Google · oltre 1.500 recensioni'},
      de: {res: 'Tisch reservieren', tel: 'Anrufen', info: '★ 4,4 auf Google · über 1.500 Bewertungen'}
    };
    var L = LL[lg] || LL.de;
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
      '@media (min-width:761px){#vnLeiste{left:auto;right:22px;bottom:22px;border-radius:18px;padding:14px 16px;max-width:380px}' +
      '#vnLeiste a{padding:14px 12px;font-size:14px}' +
      '#vnLeiste .r{gap:8px}body.vnPlatz{padding-bottom:0}}';
    document.head.appendChild(css);
    var anker = document.getElementById('reservieren') || document.getElementById('reserve');
    var ziel = anker ? '#' + anker.id : (lg === 'en' ? 'book-a-table.html' : 'reservierung.html');
    var d = document.createElement('div');
    d.id = 'vnLeiste';
    d.innerHTML = '<div class="i">' + L.info + '</div><div class="r">' +
      '<a class="y" href="' + ziel + '">' + L.res + '</a>' +
      '<a class="n" href="tel:+4319137005">' + L.tel + '</a></div>';
    document.body.appendChild(d);
    document.body.classList.add('vnPlatz');
    var breit = window.innerWidth > 760;
    var start = (p === '/' || /index\.html$|\/en\.html$/.test(p)) ? (breit ? 260 : window.innerHeight * 0.7) : (breit ? 0 : 160);
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

/* VIENERO Besucherzaehler: zaehlt Seitenaufrufe anonym in der eigenen Google Tabelle.
   Keine Cookies, kein Speicher im Browser, keine IP, keine Kennung. Gespeichert werden nur
   Seite, Herkunft (z. B. google.com), Geraetetyp und Browsersprache. */
(function () {
  try {
    var ua = navigator.userAgent || '';
    if (navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(ua)) return;
    var host = location.hostname;
    if (host !== 'vienero.at' && host !== 'www.vienero.at') return;
    var ref = '', neu = 1;
    try { if (document.referrer) ref = new URL(document.referrer).hostname.replace(/^www\./, ''); } catch (e) {}
    if (ref === 'vienero.at') { neu = 0; ref = ''; }
    /* Neu laden, Zurueck-Taste und die Danke-Seite nach einer Buchung sind kein neuer Besuch */
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav && (nav.type === 'reload' || nav.type === 'back_forward')) neu = 0;
    } catch (e) {}
    if (/danke-reservierung/.test(location.pathname)) neu = 0;
    var zone = '';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var q = new URLSearchParams(location.search);
    var herkunft = q.get('gclid') || q.get('gbraid') || q.get('wbraid') ? 'Google Anzeige'
                 : (q.get('utm_source') || ref || 'direkt');
    if (!neu) herkunft = '';
    var geraet = /iPad|Tablet/i.test(ua) ? 'Tablet' : (/Mobi|Android|iPhone/i.test(ua) ? 'Handy' : 'Computer');
    var body = JSON.stringify({ typ: 'besuch', seite: location.pathname, herkunft: herkunft,
      geraet: geraet, sprache: (navigator.language || '').slice(0, 2), neu: neu, zone: zone });
    var ziel = 'https://script.google.com/macros/s/AKfycbx4_5Qh1dGi-EBwv_Fz3uUpVO4S-TRnhfEq2SbcNCjtyJXAkBORKECpc1W3AW6Rqy3H/exec';
    var zugestimmt = false;
    try { zugestimmt = localStorage.getItem('vienero_consent_v3') === 'yes'; } catch (e) {}
    /* Nur mit Zustimmung: ungefaehrer Ort und Internetanbieter ueber ipapi.co. Die IP-Adresse selbst wird nicht gespeichert. */
    function ortHolen(fertig) {
      var erledigt = false;
      var ende = function (o) { if (!erledigt) { erledigt = true; fertig(o || {}); } };
      setTimeout(function () { ende(); }, 2000);
      try {
        fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (j) {
          if (!j || j.error) return ende();
          ende({ ort: [j.postal, j.city].filter(Boolean).join(' ').slice(0, 60),
                 land: String(j.country_name || '').slice(0, 40),
                 netz: String(j.org || '').slice(0, 80) });
        }).catch(function () { ende(); });
      } catch (e) { ende(); }
    }
    function senden(b) {
      if (navigator.sendBeacon) navigator.sendBeacon(ziel, new Blob([b], { type: 'text/plain;charset=utf-8' }));
      else fetch(ziel, { method: 'POST', body: b, keepalive: true, mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    }
    if (zugestimmt && neu) {
      ortHolen(function (o) {
        var d = JSON.parse(body); d.ort = o.ort || ''; d.land = o.land || ''; d.netz = o.netz || '';
        senden(JSON.stringify(d));
      });
    } else senden(body);

    /* Wer im Hinweis zustimmt, wird einmal mit Ort nachgetragen (zaehlt nicht als neuer Besuch) */
    window.vnOrt = function () {
      ortHolen(function (o) {
        if (!o.land) return;
        senden(JSON.stringify({ typ: 'besuch', seite: '/ort ' + location.pathname, herkunft: '', geraet: geraet,
          sprache: (navigator.language || '').slice(0, 2), neu: 0, zone: zone, ort: o.ort, land: o.land, netz: o.netz }));
      });
    };

    /* Klicks auf Reservieren und Anrufen mitzaehlen (als Eintrag "/klick/..." mit der Seite, von der geklickt wurde) */
    var gezaehlt = {};
    window.vnKlick = function (was) {
      var k = was + location.pathname;
      if (gezaehlt[k]) return;
      gezaehlt[k] = 1;
      senden(JSON.stringify({ typ: 'besuch', seite: '/klick/' + was + ' von ' + location.pathname, herkunft: '',
        geraet: geraet, sprache: (navigator.language || '').slice(0, 2), neu: 0 }));
    };
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/^tel:/.test(h)) window.vnKlick('anrufen');
      else if (/book\.stripe\.com/.test(h)) window.vnKlick('silvester-buchen');
      else if (/reservierung\.html|book-a-table\.html|#reservieren|#reserve|#reserver|thefork/.test(h)) window.vnKlick('reservieren');
    }, true);
  } catch (e) {}
})();
