/* VIENERO: Schnell reservieren.
   Einbinden mit <div id="vnBuchen" data-lang="de"></div> und <script src="vienero-buchen.js" defer></script>.
   Der Gast tippt Personen und Tag an, der TheFork-Kalender springt direkt zur Uhrzeit.
   Gibt es auf der Seite schon einen Rahmen mit id="tfRahmen", steuert die Box diesen Rahmen,
   sonst legt sie einen eigenen an. */
(function () {
  var TF = 'https://widget.thefork.com/';
  var ID = '6e88e8a8-0065-4b84-8680-2a07b443a63c';
  var TX = {
    de: { titel: 'Tisch in einer Minute reservieren', sub: 'Kostenlos, ohne Anmeldung, Bestätigung sofort per Mail.',
      pers: 'Personen', tag: 'Wann?', heute: 'Heute', morgen: 'Morgen', anders: 'Anderer Tag',
      wt: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], lade: 'Der Kalender lädt ein paar Sekunden. Lieber anrufen?',
      tel: '01 913 70 05', gross: 'Ab 9 Personen bitte kurz anrufen.' },
    en: { titel: 'Book your table in one minute', sub: 'Free of charge, no account needed, instant confirmation by email.',
      pers: 'Guests', tag: 'When?', heute: 'Today', morgen: 'Tomorrow', anders: 'Other date',
      wt: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], lade: 'The calendar takes a few seconds to load. Prefer to call?',
      tel: '+43 1 913 70 05', gross: 'For 9 or more guests please give us a call.' }
  };

  function zwei(n) { return ('0' + n).slice(-2); }
  function iso(d) { return d.getFullYear() + '-' + zwei(d.getMonth() + 1) + '-' + zwei(d.getDate()); }
  function wien() {
    try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vienna' })); } catch (e) { return new Date(); }
  }

  function init() {
    var box = document.getElementById('vnBuchen');
    if (!box) return;
    var lang = box.getAttribute('data-lang') === 'en' ? 'en' : 'de';
    var t = TX[lang];

    var css = document.createElement('style');
    css.textContent =
      '.vnb{background:#fff;border:1px solid rgba(142,113,52,.3);border-radius:18px;padding:22px 18px;text-align:left;color:#2F3133;font-family:Inter,system-ui,sans-serif}' +
      '.vnb h2{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:clamp(22px,4.5vw,28px);line-height:1.2;margin:0 0 4px}' +
      '.vnb .vnb-sub{font-size:13.5px;color:rgba(47,49,51,.68);margin:0 0 16px}' +
      '.vnb .vnb-l{display:block;font:600 10.5px/1.4 Inter,system-ui,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#8E7134;margin:0 0 7px}' +
      '.vnb .vnb-reihe{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}' +
      '.vnb button{border:1px solid #E4DFD4;background:#FDFBF7;color:#2F3133;border-radius:999px;padding:10px 15px;font:500 14px Inter,system-ui,sans-serif;cursor:pointer;min-width:46px}' +
      '.vnb button[aria-pressed="true"]{background:#C8A76A;border-color:#C8A76A;color:#2F3133;font-weight:600}' +
      '.vnb button:focus-visible{outline:2px solid #C8A76A;outline-offset:2px}' +
      '.vnb .vnb-hinweis{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:center;font-size:12.5px;color:rgba(47,49,51,.7);background:#FBF8F1;border:1px solid #EFE8DA;border-radius:10px;padding:9px 12px;margin:4px 0 10px;text-align:center}' +
      '.vnb .vnb-hinweis a{color:#2F3133;text-decoration:none;border-bottom:1px solid #C8A76A;white-space:nowrap}' +
      '.vnb iframe{display:block;width:100%;height:700px;border:0;border-radius:12px;background:#fff}' +
      '.vnb .vnb-klein{font-size:12px;color:rgba(47,49,51,.6);margin:10px 0 0;text-align:center}' +
      '@media (max-width:560px){.vnb{padding:18px 14px}.vnb iframe{height:660px}}';
    document.head.appendChild(css);

    /* Tage: heute, morgen und die naechsten Freitag und Samstag */
    var h = wien();
    var tage = [{ d: h, n: t.heute }];
    var m = new Date(h.getTime()); m.setDate(m.getDate() + 1);
    tage.push({ d: m, n: t.morgen });
    for (var i = 2; i <= 7 && tage.length < 4; i++) {
      var x = new Date(h.getTime()); x.setDate(x.getDate() + i);
      if (x.getDay() === 5 || x.getDay() === 6) tage.push({ d: x, n: t.wt[x.getDay()] + ' ' + x.getDate() + '.' + (x.getMonth() + 1) + '.' });
    }

    var ohneTitel = box.hasAttribute('data-ohne-titel');
    var html = (ohneTitel ? '' : '<h2>' + t.titel + '</h2><p class="vnb-sub">' + t.sub + '</p>') +
      '<span class="vnb-l">' + t.pers + '</span><div class="vnb-reihe" data-gruppe="pax">';
    for (var p = 1; p <= 8; p++) html += '<button type="button" data-pax="' + p + '" aria-pressed="' + (p === 2) + '">' + p + '</button>';
    html += '</div><span class="vnb-l">' + t.tag + '</span><div class="vnb-reihe" data-gruppe="tag">';
    for (var k = 0; k < tage.length; k++) html += '<button type="button" data-tag="' + iso(tage[k].d) + '" aria-pressed="false">' + tage[k].n + '</button>';
    html += '<button type="button" data-tag="" aria-pressed="false">' + t.anders + '</button></div>' +
      '<p class="vnb-hinweis">' + t.lade + ' <a href="tel:+4319137005">' + t.tel + '</a></p>';

    var eigenerRahmen = document.getElementById('tfRahmen');
    var div = document.createElement('div');
    div.className = 'vnb';
    div.innerHTML = html + (eigenerRahmen ? '' : '<iframe title="' + t.titel + '" loading="lazy"></iframe>') +
      '<p class="vnb-klein">' + t.gross + '</p>';
    box.appendChild(div);
    var rahmen = eigenerRahmen || div.querySelector('iframe');

    var pax = 2, tag = null;
    function laden() {
      var url = TF + lang + '/' + ID;
      if (tag) url += '?step=hour&date=' + tag + '&pax=' + pax;
      else if (tag === '') url += '?step=date&pax=' + pax;
      rahmen.src = url;
    }
    function waehlen(gruppe, knopf) {
      [].slice.call(div.querySelectorAll('[data-gruppe="' + gruppe + '"] button')).forEach(function (b) {
        b.setAttribute('aria-pressed', b === knopf ? 'true' : 'false');
      });
    }
    div.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null;
      if (!b) return;
      if (b.hasAttribute('data-pax')) { pax = +b.getAttribute('data-pax'); waehlen('pax', b); if (tag !== null) laden(); }
      if (b.hasAttribute('data-tag')) { tag = b.getAttribute('data-tag'); waehlen('tag', b); laden(); }
      if (window.vnKlick) window.vnKlick('reservieren');
    });

    /* Ohne eigenen Rahmen: Kalender laden, sobald die Box in Sicht kommt */
    if (!eigenerRahmen) {
      var start = function () { if (!rahmen.src) laden(); };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { start(); io.disconnect(); } }, { rootMargin: '300px' });
        io.observe(div);
      } else start();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
