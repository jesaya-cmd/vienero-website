/* VIENERO: Anfrageformular fuer Feiern und Veranstaltungen.
   Einbinden mit <div id="vnAnfrage" data-anlass="Weihnachtsfeier"></div>
   und <script src="vienero-anfrage.js" defer></script>.
   Die Anfrage geht an das VIENERO-Skript (Blatt "Anfragen" plus Mail ans Team).
   Klappt das Senden nicht, bietet das Formular Mail und Telefon mit den
   eingegebenen Angaben an, damit keine Anfrage verloren geht. */
(function () {
  var ZIEL = 'https://script.google.com/macros/s/AKfycbx4_5Qh1dGi-EBwv_Fz3uUpVO4S-TRnhfEq2SbcNCjtyJXAkBORKECpc1W3AW6Rqy3H/exec';
  var CONV = 'AW-18506650716/KYqYCLXTyK8dENyo1PhE'; /* Anfrage Feier und Gruppe (Formular), Wert 50 */
  var ANLAESSE = ['Weihnachtsfeier', 'Firmenfeier', 'Geburtstag', 'Hochzeit oder Taufe',
                  'Jubiläum', 'Kundenabend', 'Familienfeier', 'Sonstiges'];
  /* Englische Fassung: <div id="vnAnfrage" data-lang="en">. Die Werte gehen auf Deutsch
     ans Skript, damit Tabelle und Team-Mail einheitlich bleiben. */
  var ANLAESSE_EN = ['Christmas party', 'Company party', 'Birthday', 'Wedding or christening',
                     'Anniversary', 'Client dinner', 'Family celebration', 'Other'];
  var T = {
    de: { titel: 'Feier anfragen', sub: 'Ein paar Angaben genügen, wir melden uns innerhalb von 24 Stunden mit einem Vorschlag.',
      anlass: 'Anlass', gaeste: 'Gäste', bsp: 'z. B. 25', datum: 'Wunschdatum', zeit: 'Gewünschte Uhrzeit', waehlen: 'Bitte wählen',
      bereich: 'Bereich', offen: 'Noch offen', teil: 'Teilbereich', ganz: 'Ganzes Lokal', name: 'Name', firma: 'Firma (optional)',
      mail: 'E-Mail', tel: 'Telefon', wunsch: 'Wünsche', wunschPh: 'Menu, Getränke, Musik, DJ, alles, was Ihnen wichtig ist',
      senden: 'Anfrage senden', sendet: 'Wird gesendet …',
      klein: 'Unverbindlich. Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten. <a href="datenschutz.html">Datenschutz</a>',
      fAnlass: 'Bitte wählen Sie den Anlass.', fZeit: 'Bitte wählen Sie die gewünschte Uhrzeit.', fName: 'Bitte geben Sie Ihren Namen an.',
      fMail: 'Bitte prüfen Sie Ihre E-Mail-Adresse.', fTel: 'Bitte geben Sie eine Telefonnummer an, damit wir Sie rasch erreichen.',
      fSenden: 'Das Senden hat gerade nicht geklappt. Ihre Angaben sind noch da.', perMail: 'Per Mail senden', oder: 'oder anrufen:',
      danke: 'Danke, ', dankeText: 'Ihre Anfrage ist bei uns. Wir melden uns innerhalb von 24 Stunden mit einem Vorschlag, meistens schneller. Eine Bestätigung ist schon an ',
      dankeEnde: ' unterwegs.' },
    en: { titel: 'Request your event', sub: 'A few details are enough. We will get back to you within 24 hours with a proposal.',
      anlass: 'Occasion', gaeste: 'Guests', bsp: 'e.g. 25', datum: 'Preferred date', zeit: 'Preferred time', waehlen: 'Please choose',
      bereich: 'Area', offen: 'Not decided yet', teil: 'Part of the restaurant', ganz: 'Whole restaurant', name: 'Name', firma: 'Company (optional)',
      mail: 'Email', tel: 'Phone', wunsch: 'Your wishes', wunschPh: 'Menu, drinks, music, DJ, anything that matters to you',
      senden: 'Send request', sendet: 'Sending …',
      klein: 'No obligation. We only use your details to answer your request. <a href="datenschutz.html">Privacy</a>',
      fAnlass: 'Please choose the occasion.', fZeit: 'Please choose your preferred time.', fName: 'Please enter your name.',
      fMail: 'Please check your email address.', fTel: 'Please enter a phone number so we can reach you quickly.',
      fSenden: 'Sending did not work just now. Your details are still here.', perMail: 'Send by email', oder: 'or call:',
      danke: 'Thank you, ', dankeText: 'We have received your request and will get back to you within 24 hours with a proposal, usually sooner. A confirmation is on its way to ',
      dankeEnde: '.' }
  };

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    var box = document.getElementById('vnAnfrage');
    if (!box) return;
    var vorwahl = box.getAttribute('data-anlass') || '';
    var en = box.getAttribute('data-lang') === 'en';
    var t = en ? T.en : T.de;
    var BEREICH_DE = { offen: '', teil: 'Teilbereich', ganz: 'Ganzes Lokal' };

    var css = el('style');
    css.textContent =
      '.vna{background:#fff;border:1px solid rgba(142,113,52,.3);border-radius:16px;padding:24px 20px;text-align:left}' +
      '.vna h3{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:22px;margin:0 0 4px;color:#2F3133}' +
      '.vna .vna-sub{font-size:13.5px;color:rgba(47,49,51,.68);margin:0 0 18px}' +
      '.vna-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
      '.vna-voll{grid-column:1/-1}' +
      '.vna label{display:block;font:600 10.5px/1.4 Inter,system-ui,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#8E7134;margin-bottom:5px}' +
      '.vna input,.vna select,.vna textarea{width:100%;box-sizing:border-box;border:1px solid #E4DFD4;border-radius:10px;padding:12px 13px;font:15px/1.4 Inter,system-ui,sans-serif;color:#2F3133;background:#FDFBF7;-webkit-appearance:none;appearance:none}' +
      '.vna select{background-image:linear-gradient(45deg,transparent 50%,#8E7134 50%),linear-gradient(135deg,#8E7134 50%,transparent 50%);background-position:calc(100% - 18px) 52%,calc(100% - 13px) 52%;background-size:5px 5px;background-repeat:no-repeat;padding-right:34px}' +
      '.vna textarea{min-height:96px;resize:vertical}' +
      '.vna input:focus,.vna select:focus,.vna textarea:focus{outline:2px solid #C8A76A;outline-offset:1px;border-color:#C8A76A}' +
      '.vna .vna-falle{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
      '.vna button{margin-top:18px;width:100%;border:0;border-radius:999px;padding:15px 20px;background:#C8A76A;color:#2F3133;font:600 12.5px Inter,system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;cursor:pointer}' +
      '.vna button[disabled]{opacity:.6;cursor:default}' +
      '.vna .vna-klein{font-size:12px;color:rgba(47,49,51,.6);margin:12px 0 0;line-height:1.6}' +
      '.vna .vna-klein a{color:#8E7134}' +
      '.vna .vna-fehler{display:none;margin-top:14px;padding:14px;border-radius:10px;background:#FBF3E6;font-size:14px;line-height:1.6}' +
      '.vna .vna-fehler a{color:#8E7134;font-weight:600}' +
      '.vna-danke{text-align:center;padding:10px 4px}' +
      '.vna-danke b{display:block;font-family:Fraunces,Georgia,serif;font-weight:400;font-size:24px;margin-bottom:8px}' +
      '.vna-danke p{font-size:14.5px;color:rgba(47,49,51,.75);line-height:1.7;margin:0}' +
      '@media (max-width:560px){.vna-grid{grid-template-columns:1fr}.vna{padding:20px 16px}}';
    document.head.appendChild(css);

    var heute = new Date();
    var min = heute.getFullYear() + '-' + ('0' + (heute.getMonth() + 1)).slice(-2) + '-' + ('0' + heute.getDate()).slice(-2);

    var optionen = '<option value="">' + t.waehlen + '</option>';
    for (var i = 0; i < ANLAESSE.length; i++) {
      optionen += '<option value="' + ANLAESSE[i] + '"' + (ANLAESSE[i] === vorwahl ? ' selected' : '') + '>' +
                  (en ? ANLAESSE_EN[i] : ANLAESSE[i]) + '</option>';
    }

    var zeiten = '<option value="">' + t.waehlen + '</option>';
    for (var h = 12; h <= 22; h++) {
      zeiten += '<option value="' + h + ':00">' + h + ':00</option>';
      if (h < 22) zeiten += '<option value="' + h + ':30">' + h + ':30</option>';
    }

    var form = el('form', { 'class': 'vna', novalidate: 'novalidate', translate: 'no' },
      '<h3>' + t.titel + '</h3>' +
      '<p class="vna-sub">' + t.sub + '</p>' +
      '<div class="vna-grid">' +
        '<div><label for="vnaAnlass">' + t.anlass + '</label><select id="vnaAnlass" name="anlass" required>' + optionen + '</select></div>' +
        '<div><label for="vnaGaeste">' + t.gaeste + '</label><input id="vnaGaeste" name="gaeste" type="number" inputmode="numeric" min="2" max="300" placeholder="' + t.bsp + '"></div>' +
        '<div><label for="vnaDatum">' + t.datum + '</label><input id="vnaDatum" name="datum" type="date" min="' + min + '"></div>' +
        '<div><label for="vnaZeit">' + t.zeit + '</label><select id="vnaZeit" name="uhrzeit" required>' + zeiten + '</select></div>' +
        '<div class="vna-voll"><label for="vnaBereich">' + t.bereich + '</label><select id="vnaBereich" name="bereich">' +
          '<option value="">' + t.offen + '</option><option value="Teilbereich">' + t.teil + '</option>' +
          '<option value="Ganzes Lokal">' + t.ganz + '</option></select></div>' +
        '<div><label for="vnaName">' + t.name + '</label><input id="vnaName" name="name" autocomplete="name" required></div>' +
        '<div><label for="vnaFirma">' + t.firma + '</label><input id="vnaFirma" name="firma" autocomplete="organization"></div>' +
        '<div><label for="vnaMail">' + t.mail + '</label><input id="vnaMail" name="email" type="email" autocomplete="email" required></div>' +
        '<div><label for="vnaTel">' + t.tel + '</label><input id="vnaTel" name="telefon" type="tel" autocomplete="tel" required></div>' +
        '<div class="vna-voll"><label for="vnaWunsch">' + t.wunsch + '</label><textarea id="vnaWunsch" name="wuensche" placeholder="' + t.wunschPh + '"></textarea></div>' +
      '</div>' +
      '<div class="vna-falle" aria-hidden="true"><label>Webseite<input name="webseite" tabindex="-1" autocomplete="off"></label></div>' +
      '<button type="submit">' + t.senden + '</button>' +
      '<p class="vna-klein">' + t.klein + '</p>' +
      '<div class="vna-fehler" role="alert"></div>');
    box.appendChild(form);

    var knopf = form.querySelector('button');

    /* Ab 1. Februar 2027 ist erst ab 16 Uhr offen: fruehere Zeiten sperren */
    function zeitenPruefen() {
      var d = form.elements.datum.value, sel = form.elements.uhrzeit;
      var spaet = d && d >= '2027-02-01';
      for (var i = 1; i < sel.options.length; i++) {
        var aus = spaet && parseInt(sel.options[i].text, 10) < 16;
        sel.options[i].disabled = aus;
        if (aus && sel.selectedIndex === i) sel.selectedIndex = 0;
      }
    }
    form.elements.datum.addEventListener('change', zeitenPruefen);
    var fehler = form.querySelector('.vna-fehler');

    function wert(n) { var f = form.elements[n]; return f ? String(f.value || '').trim() : ''; }

    function zeigeFehler(text, mitAusweg) {
      var html = text;
      if (mitAusweg) {
        var datum = wert('datum');
        var body = 'Anlass: ' + wert('anlass') + '\nWunschdatum: ' + datum + '\nUhrzeit: ' + wert('uhrzeit') + '\nGäste: ' + wert('gaeste') +
                   '\nBereich: ' + wert('bereich') + '\nName: ' + wert('name') + '\nFirma: ' + wert('firma') +
                   '\nTelefon: ' + wert('telefon') + '\nWünsche: ' + wert('wuensche');
        var mail = 'mailto:Reservierung@vienero.at?subject=' + encodeURIComponent('Anfrage ' + (wert('anlass') || 'Feier') + ' im VIENERO') +
                   '&body=' + encodeURIComponent(body);
        html += '<br><a href="' + mail + '">' + t.perMail + '</a> ' + t.oder + ' <a href="tel:+4319137005">' + (en ? '+43 1 913 70 05' : '01 913 70 05') + '</a>';
      }
      fehler.innerHTML = html;
      fehler.style.display = 'block';
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      fehler.style.display = 'none';
      if (!wert('anlass')) { zeigeFehler(t.fAnlass); form.elements.anlass.focus(); return; }
      if (!wert('uhrzeit')) { zeigeFehler(t.fZeit); form.elements.uhrzeit.focus(); return; }
      if (!wert('name')) { zeigeFehler(t.fName); form.elements.name.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(wert('email'))) { zeigeFehler(t.fMail); form.elements.email.focus(); return; }
      if (wert('telefon').replace(/[^0-9]/g, '').length < 6) { zeigeFehler(t.fTel); form.elements.telefon.focus(); return; }

      var datum = wert('datum');
      if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) { var dt = datum.split('-'); datum = dt[2] + '.' + dt[1] + '.' + dt[0]; }

      var daten = {
        typ: 'anfrage', anlass: wert('anlass'), datum: datum, uhrzeit: wert('uhrzeit'), gaeste: wert('gaeste'), bereich: wert('bereich'),
        name: wert('name'), firma: wert('firma'), email: wert('email'), telefon: wert('telefon'),
        wuensche: wert('wuensche'), sprache: en ? 'en' : 'de', webseite: wert('webseite'), seite: location.pathname
      };

      knopf.disabled = true;
      knopf.textContent = t.sendet;

      fetch(ZIEL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(daten) })
        .then(function (r) { return r.json(); })
        .then(function (a) {
          if (!a || !a.ok) throw new Error((a && a.fehler) || 'Fehler');
          try {
            if (window.gtag) {
              window.gtag('event', 'conversion', { send_to: CONV });
              window.gtag('event', 'generate_lead', { anlass: daten.anlass });
            }
          } catch (x) {}
          var danke = el('div', { 'class': 'vna vna-danke', role: 'status' },
            '<b>' + t.danke + daten.name.replace(/[<>&]/g, '') + '.</b>' +
            '<p>' + t.dankeText + daten.email.replace(/[<>&]/g, '') + t.dankeEnde + '</p>');
          box.replaceChild(danke, form);
          danke.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          knopf.disabled = false;
          knopf.textContent = t.senden;
          zeigeFehler(t.fSenden, true);
        });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
