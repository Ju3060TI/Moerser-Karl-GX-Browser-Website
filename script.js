// ===== index.html: Fach-Auswahl an den Button-Link koppeln =====
document.addEventListener("DOMContentLoaded", function () {

    // --- Teil 1: Startseite: Button-Link setzen ---
    const subjectSelect = document.getElementById("subject-select");
    const startButton = document.getElementById("start-browser");

    if (subjectSelect && startButton) {
        function updateLink() {
            const subject = subjectSelect.value;
            startButton.href = "browser.html?fach=" + subject;
        }

        subjectSelect.addEventListener("change", updateLink);
        updateLink(); // Beim Laden sofort setzen
    }

    // --- Teil 2: Browser-Seite: Fach aus URL auslesen und Titel setzen ---
    const params = new URLSearchParams(window.location.search);
    const fach = params.get("fach");

    const titelElement = document.getElementById("fach-titel");
    const unterschriftElement = document.getElementById("fach-unterschrift");

    const fachNamen = {
        mathe: "Mathe-Calculator",
        deutsch: "Deutsch-Wörterbuch",
        englisch: "Englisch-Wörterbuch",
        geschichte: "Geschichts-Zeitleiste",
        biologie: "Biologie-Lexikon",
        physik: "Physik-Formelsammlung",
        chemie: "Chemie-Periodensystem",
        turnen: "Turnen-Übungen",
        soz: "Soz-Themen",
        freistunde: "Freistunde – entspann dich!",
        "digitale-grundbildung": "Digitale Grundbildung",
        musik: "Musik-Player"
    };

    const fachUnterschrift = {
        mathe: "Rechner, Formeln & mehr",
        deutsch: "Wörterbuch, Rechtschreibung & Grammatik",
        englisch: "Dictionary, Translation & Grammar",
        geschichte: "Ereignisse, Epochen & Personen",
        biologie: "Lexikon, Arten & Zellen",
        physik: "Formeln, Gesetze & Experimente",
        chemie: "Elemente, Reaktionen & Labor",
        turnen: "Übungen, Regeln & Techniken",
        soz: "Politik, Gesellschaft & Wirtschaft",
        freistunde: "Zeit zum Chillen! 😎",
        "digitale-grundbildung": "Computer, Internet & Medien",
        musik: "Songs, Instrumente & Noten"
    };

    if (titelElement && fach && fachNamen[fach]) {
        titelElement.textContent = fachNamen[fach];
        if (unterschriftElement && fachUnterschrift[fach]) {
            unterschriftElement.textContent = fachUnterschrift[fach];
        }
    } else if (titelElement) {
        titelElement.textContent = "GX Browser";
    }

});
