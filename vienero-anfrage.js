/* VIENERO: Anfrageformular fuer Feiern und Veranstaltungen.
   Einbinden mit <div id="vnAnfrage" data-anlass="Weihnachtsfeier"></div>
   und <script src="vienero-anfrage.js" defer></script>.
   Die Anfrage geht an das VIENERO-Skript (Blatt "Anfragen" plus Mail ans Team).
   Klappt das Senden nicht, bietet das Formular Mail und Telefon mit den
   eingegebenen Angaben an, damit keine Anfrage verloren geht. */
(function () {
  var ZIEL = 'https://script.google.com/macros/s/AKfycbx4_5Qh1dGi-EBwv_Fz3uUpVO4S-TRnhfEq2SbcNCjtyJXAkBORKECpc1W3AW6Rqy3H/exec';
  var CONV = 'AW-18506650716/FYBXCNr-g5kdENyo1PhE';
  var ANLAESSE = ['Weihnachtsfeier', 'Firmenfeier', 'Geburtstag', 'Hochzeit oder Taufe',
                  'Jubiläum', 'Kundenabend', 'Familienfeier', 'Sonstiges'];

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

    var optionen = '<option value="">Bitte wählen</option>';
    for (var i = 0; i < ANLAESSE.length; i++) {
      optionen += '<option' + (ANLAESSE[i] === vorwahl ? ' selected' : '') + '>' + ANLAESSE[i] + '</option>';
    }

    var form = el('form', { 'class': 'vna', novalidate: 'novalidate' },
      '<h3>Feier anfragen</h3>' +
      '<p class="vna-sub">Ein paar Angaben genügen, wir melden uns innerhalb von 24 Stunden mit einem Vorschlag.</p>' +
      '<div class="vna-grid">' +
        '<div><label for="vnaAnlass">Anlass</label><select id="vnaAnlass" name="anlass" required>' + optionen + '</select></div>' +
        '<div><label for="vnaDatum">Wunschdatum</label><input id="vnaDatum" name="datum" type="date" min="' + min + '"></div>' +
        '<div><label for="vnaGaeste">Gäste</label><input id="vnaGaeste" name="gaeste" type="number" inputmode="numeric" min="2" max="300" placeholder="z. B. 25"></div>' +
        '<div><label for="vnaBereich">Bereich</label><select id="vnaBereich" name="bereich">' +
          '<option value="">Noch offen</option><option>Teilbereich</option><option>Ganzes Lokal</option></select></div>' +
        '<div><label for="vnaName">Name</label><input id="vnaName" name="name" autocomplete="name" required></div>' +
        '<div><label for="vnaFirma">Firma (optional)</label><input id="vnaFirma" name="firma" autocomplete="organization"></div>' +
        '<div><label for="vnaMail">E-Mail</label><input id="vnaMail" name="email" type="email" autocomplete="email" required></div>' +
        '<div><label for="vnaTel">Telefon</label><input id="vnaTel" name="telefon" type="tel" autocomplete="tel" required></div>' +
        '<div class="vna-voll"><label for="vnaWunsch">Wünsche</label><textarea id="vnaWunsch" name="wuensche" placeholder="Menu, Getränke, Musik, DJ, Uhrzeit, alles, was Ihnen wichtig ist"></textarea></div>' +
      '</div>' +
      '<div class="vna-falle" aria-hidden="true"><label>Webseite<input name="webseite" tabindex="-1" autocomplete="off"></label></div>' +
      '<button type="submit">Anfrage senden</button>' +
      '<p class="vna-klein">Unverbindlich. Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten. <a href="datenschutz.html">Datenschutz</a></p>' +
      '<div class="vna-fehler" role="alert"></div>');
    box.appendChild(form);

    var knopf = form.querySelector('button');
    var fehler = form.querySelector('.vna-fehler');

    function wert(n) { var f = form.elements[n]; return f ? String(f.value || '').trim() : ''; }

    function zeigeFehler(text, mitAusweg) {
      var html = text;
      if (mitAusweg) {
        var datum = wert('datum');
        var body = 'Anlass: ' + wert('anlass') + '\nWunschdatum: ' + datum + '\nGäste: ' + wert('gaeste') +
                   '\nBereich: ' + wert('bereich') + '\nName: ' + wert('name') + '\nFirma: ' + wert('firma') +
                   '\nTelefon: ' + wert('telefon') + '\nWünsche: ' + wert('wuensche');
        var mail = 'mailto:Reservierung@vienero.at?subject=' + encodeURIComponent('Anfrage ' + (wert('anlass') || 'Feier') + ' im VIENERO') +
                   '&body=' + encodeURIComponent(body);
        html += '<br><a href="' + mail + '">Per Mail senden</a> oder anrufen: <a href="tel:+4319137005">01 913 70 05</a>';
      }
      fehler.innerHTML = html;
      fehler.style.display = 'block';
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      fehler.style.display = 'none';
      if (!wert('anlass')) { zeigeFehler('Bitte wählen Sie den Anlass.'); form.elements.anlass.focus(); return; }
      if (!wert('name')) { zeigeFehler('Bitte geben Sie Ihren Namen an.'); form.elements.name.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(wert('email'))) { zeigeFehler('Bitte prüfen Sie Ihre E-Mail-Adresse.'); form.elements.email.focus(); return; }
      if (wert('telefon').replace(/[^0-9]/g, '').length < 6) { zeigeFehler('Bitte geben Sie eine Telefonnummer an, damit wir Sie rasch erreichen.'); form.elements.telefon.focus(); return; }

      var datum = wert('datum');
      if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) { var t = datum.split('-'); datum = t[2] + '.' + t[1] + '.' + t[0]; }

      var daten = {
        typ: 'anfrage', anlass: wert('anlass'), datum: datum, gaeste: wert('gaeste'), bereich: wert('bereich'),
        name: wert('name'), firma: wert('firma'), email: wert('email'), telefon: wert('telefon'),
        wuensche: wert('wuensche'), webseite: wert('webseite'), seite: location.pathname
      };

      knopf.disabled = true;
      knopf.textContent = 'Wird gesendet …';

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
            '<b>Danke, ' + daten.name.replace(/[<>&]/g, '') + '.</b>' +
            '<p>Ihre Anfrage ist bei uns. Wir melden uns innerhalb von 24 Stunden mit einem Vorschlag, meistens schneller. ' +
            'Eine Bestätigung ist schon an ' + daten.email.replace(/[<>&]/g, '') + ' unterwegs.</p>');
          box.replaceChild(danke, form);
          danke.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          knopf.disabled = false;
          knopf.textContent = 'Anfrage senden';
          zeigeFehler('Das Senden hat gerade nicht geklappt. Ihre Angaben sind noch da.', true);
        });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
