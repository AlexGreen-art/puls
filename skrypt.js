/* ---- Pasek stanu: co pokazać zależy od tego, która jest godzina ---- */
(function () {
  var pasek = document.getElementById("stan");
  if (!pasek) return;

  var dni = ["niedzielę", "poniedziałek", "wtorek", "środę", "czwartek", "piątek", "sobotę"];

  function godziny(d) {           // zwraca [otwarcie, zamkniecie] albo null
    if (d >= 1 && d <= 5) return [8, 20];
    if (d === 6) return [8, 14];
    return null;                  // niedziela
  }

  function nastepneOtwarcie(teraz) {
    var d = teraz.getDay(), h = teraz.getHours() + teraz.getMinutes() / 60;
    var dzis = godziny(d);
    if (dzis && h < dzis[0]) return { kiedy: "dziś", godz: dzis[0] };
    for (var i = 1; i <= 7; i++) {
      var nd = (d + i) % 7, g = godziny(nd);
      if (g) return { kiedy: i === 1 ? "jutro" : "w " + dni[nd], godz: g[0] };
    }
    return null;
  }

  function odswiez() {
    var teraz = new Date();
    var d = teraz.getDay(), h = teraz.getHours() + teraz.getMinutes() / 60;
    var g = godziny(d);
    var glowny = pasek.querySelector(".stan-glowny");
    var drugi = pasek.querySelector(".stan-drugi");

    if (g && h >= g[0] && h < g[1]) {
      pasek.classList.remove("zamkniete");
      glowny.innerHTML = '<span class="kropka"></span>Otwarte — dziś do <b>' + g[1] + ':00</b>';
      drugi.innerHTML = 'Rejestracja: <a href="tel:+48422154090">42 215 40 90</a> · nagłe przypadki bez zapowiedzi';
    } else {
      pasek.classList.add("zamkniete");
      var n = nastepneOtwarcie(teraz);
      var tekst = n ? "Otwieramy " + n.kiedy + " o <b>" + n.godz + ":00</b>" : "";
      glowny.innerHTML = '<span class="kropka"></span>Teraz zamknięte. ' + tekst;
      drugi.innerHTML = 'Dyżur telefoniczny do 23:00: <a href="tel:+48601220118">601 220 118</a> · ' +
        'całodobowa: Łódź, ul. Pabianicka, 14 km';
    }
  }

  odswiez();
  setInterval(odswiez, 60000);
})();

/* ---- Licznik rachunku ---- */
(function () {
  var pozycje = document.querySelectorAll(".pozycja");
  var kwota = document.getElementById("suma-kwota");
  if (!pozycje.length || !kwota) return;

  function przelicz() {
    var suma = 0;
    pozycje.forEach(function (p) {
      if (p.getAttribute("aria-pressed") === "true") suma += Number(p.dataset.cena);
    });
    kwota.textContent = suma + " zł";
  }

  pozycje.forEach(function (p) {
    p.addEventListener("click", function () {
      p.setAttribute("aria-pressed", p.getAttribute("aria-pressed") === "true" ? "false" : "true");
      przelicz();
    });
  });

  przelicz();
})();

/* ---- Zastępniki brakujących zdjęć ---- */
document.querySelectorAll(".ph img").forEach(function (img) {
  var brak = function () { img.closest(".ph").classList.add("brak"); };
  img.addEventListener("error", brak);
  if (img.complete && img.naturalWidth === 0) brak();
});
