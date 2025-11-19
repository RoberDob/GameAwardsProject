class Igra {
    constructor(naslov, opis, razvijalci, ocena, slika) {
        this.naslov = naslov;
        this.opis = opis;
        this.razvijalci = razvijalci;
        this.ocena = ocena;
        this.slika = slika;
    }

    izpisiNaslov() {
        return `${this.naslov}`;
    }

    izpisiPodrobnosti() {
        return `Opis igre: ${this.opis}`;
    }
}

class SeznamIger {
    constructor() {
        this.igre = [];
    }

    dodajIgro(igra) {
        this.igre.push(igra);
        this.izpisiIgro(igra);
    }

    izpisiIgro(igra) {
        const id = `igra${Date.now()}`;

        const $container = $("<div>").addClass("list-group").attr("id", id);

        const $a = $("<a>")
            .attr("href", "#")
            .addClass("list-group-item list-group-item-action");

        const $div = $("<div>").addClass("d-flex w-100 justify-content-between");

        const $h5 = $("<h5>").addClass("mb-1").text(igra.izpisiNaslov());
        const $ocena = $("<small>").text(`Ocena: ${igra.ocena}`);

        $div.append($h5, $ocena);

        const $p = $("<p>").addClass("mb-1").text(igra.izpisiPodrobnosti());

        const $ul = $("<ul>");
        igra.razvijalci.forEach(razv => {
            $ul.append($("<li>").text(razv));
        });

        const $small = $("<small>").append($ul);

        $a.append($div, $p, $small);

        const $brisanje = $("<a>")
            .attr("href", "#")
            .addClass("btn btn-danger")
            .text("Izbriši igro")
            .on("click", () => {
                this.brisi($container);
                $li.remove();
                odstraniIzPriljubljenih(igra.naslov);
            });

        const $img = $("<img>")
            .attr("src", igra.slika)
            .addClass("img-fluid img-thumbnail");

        $container.append($a, $brisanje, $img);
        $("#section4").append($container);

        // Dodaj v navigacijski dropdown
        const $link = $("<a>")
            .addClass("dropdown-item")
            .attr("href", `#${id}`)
            .text(igra.izpisiNaslov());

        const $li = $("<li>").attr("id", `dropdown-${id}`).append($link);
        $(".dropdown-menu").append($li);
    }

    brisi(element) {
        element.remove();
    }

    isciPoRazvijalcu(iskaniRazvijalec) {
        iskaniRazvijalec = iskaniRazvijalec.toLowerCase();

        $("article").each(function () {
            let razvijalciTekst = "";
            $(this).find("ul li").each(function () {
                razvijalciTekst += $(this).text().toLowerCase() + " ";
            });

            if (razvijalciTekst.includes(iskaniRazvijalec)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

}

class Program {
    constructor() {
        this.skrijObvestilo();
    }

    skrijObvestilo() {
        const obvestilo = document.querySelector(".alert-success");
        if (obvestilo) {
            obvestilo.style.display = "none";
        }
    }

    dodajIgroIzObrazca(seznamIger) {
        const naslovInput = document.querySelector("#modalNaslov");
        const opisInput = document.querySelector("#modalOpis");
        const razvijalciInput = document.querySelector("#modalRazvijalci");
        const ocenaInput = document.querySelector("#modalOcena");
        const slikaInput = document.querySelector("#modalSlika");
        const napakaElement = document.querySelector("#napakaObrazec");
        const obvestiloElement = document.getElementById("uspesnoObvestilo");

        const naslov = naslovInput.value.trim();
        const opis = opisInput.value.trim();
        const razvijalci = razvijalciInput.value.trim().split("\n").filter(r => r.trim() !== "");
        const ocena = ocenaInput.value;
        const slika = slikaInput.value.trim();

        const pattern = new RegExp(naslovInput.pattern);

        let napake = [];

        if (naslov.length <= 10 || !pattern.test(naslov)) {
            napake.push("Naslov mora imeti več kot 10 znakov in ustrezati vzorcu.");
        }
        if (opis.length <= 10) {
            napake.push("Opis mora imeti več kot 10 znakov.");
        }
        if (slika.length <= 10) {
            napake.push("URL slike mora imeti več kot 10 znakov.");
        }

        if (napake.length > 0) {
            napakaElement.innerHTML = napake.join("<br>");
            napakaElement.style.display = "block";
            return;
        }

        napakaElement.style.display = "none";

        const novaIgra = new Igra(naslov, opis, razvijalci, ocena, slika);
        seznamIger.dodajIgro(novaIgra);

        const modal = bootstrap.Modal.getInstance(document.getElementById("dodajIgroModal"));
        modal.hide();

        document.querySelector("#modalForma").reset();

        obvestiloElement.style.display = "block";
        setTimeout(() => {
            obvestiloElement.style.display = "none";
        }, 3000);
    }
}

$(document).ready(function () {
    const program = new Program();
    const seznam = new SeznamIger();

    const modal = new bootstrap.Modal(document.getElementById('dodajIgroModal'));

    let globalneIgre = [];

    $("#dodajNovoBtn").on("click", function (e) {
        e.preventDefault();
        modal.show();
    });

    $("#ponastaviModal").on("click", function () {
        $("#modalForma")[0].reset();
        modal.hide();
    });

    $("#modalForma").on("submit", function (e) {
        e.preventDefault();
        program.dodajIgroIzObrazca(seznam);
    });

    $("#glavniObrazec").on("submit", function (event) {
        event.preventDefault();

        const naslov = $("#naslov").val();
        const opis = $("#opis").val();
        const razvText = $("#develepers").val();
        const razvijalci = razvText.split("\n").filter(i => i.trim() !== "");
        const ocena = $("#ocena").val();
        const slika = $("#slika").val();

        const novaIgra = new Igra(naslov, opis, razvijalci, ocena, slika);
        seznam.dodajIgro(novaIgra);

        program.skrijObvestilo();

        this.reset();
        $("#prikazOcene").text("5.5");
    });

    $("aside ul").empty();
    $("aside table thead").remove();
    $("aside table").prepend(`
        <thead>
            <tr>
                <th>Igra</th>
                <th>Opis</th>
                <th>Ocena</th>
                <th>Možnosti</th>
            </tr>
        </thead>
    `);

    const apiKey = 'e272178d83c04da8b33b67d24ecf8fea';
    const url = `https://api.rawg.io/api/games?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Napaka pri pridobivanju podatkov');
            }
            return response.json();
        })
        .then(data => {
            const games = data.results;
            globalneIgre = games;
            const tbody = document.getElementById('gamesBody');
            tbody.innerHTML = '';

            games.forEach(game => {
                const title = game.name || 'Brez naslova';
                const description = game.slug || 'Ni opisa';
                const rating = game.rating !== null ? game.rating : 'N/A';

                const row = document.createElement('tr');

                const titleCell = document.createElement('td');
                titleCell.textContent = title;

                const descCell = document.createElement('td');
                descCell.textContent = description;

                const ratingCell = document.createElement('td');
                ratingCell.textContent = rating;

                // Gumb +
                const optionsCell = document.createElement('td');
                const btnDodaj = document.createElement('button');
                btnDodaj.textContent = '+';
                btnDodaj.setAttribute('data-id', game.id);
                btnDodaj.classList.add('btn', 'btn-success', 'btn-sm');
                btnDodaj.addEventListener('click', dodajIgroVKolekcijo);
                optionsCell.appendChild(btnDodaj);

                row.appendChild(titleCell);
                row.appendChild(descCell);
                row.appendChild(ratingCell);
                row.appendChild(optionsCell);

                tbody.appendChild(row);
            });

            osveziSeznamPriljubljenih();
        })
        .catch(error => {
            console.error('Napaka:', error);
        });

    function dodajIgroVKolekcijo(event) {
        const id = parseInt(event.target.getAttribute('data-id'));
        const igra = globalneIgre.find(g => g.id === id);
        if (!igra) return;

        let igreLS = JSON.parse(localStorage.getItem('igreLS')) || [];

        if (igreLS.some(i => i.id === id)) {
            alert('Že obstaja!');
            return;
        }

        igreLS.push(igra);
        localStorage.setItem('igreLS', JSON.stringify(igreLS));

        osveziSeznamPriljubljenih();
    }

    function osveziSeznamPriljubljenih() {
        const priljubljene = JSON.parse(localStorage.getItem('igreLS')) || [];
        const seznam = document.getElementById('seznamPriljubljenih');
        if (!seznam) return;
        seznam.innerHTML = '';

        priljubljene.forEach(igra => {
            const li = document.createElement('li');
            li.textContent = igra.name || igra.naslov || 'Brez naslova';
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                if (confirm('Želite izbrisati zapis?')) {
                    odstraniIzPriljubljenih(igra.id);
                }
            });
            seznam.appendChild(li);
        });
    }

    function odstraniIzPriljubljenih(id) {
        let igreLS = JSON.parse(localStorage.getItem('igreLS')) || [];
        igreLS = igreLS.filter(i => i.id !== id);
        localStorage.setItem('igreLS', JSON.stringify(igreLS));
        osveziSeznamPriljubljenih();
    }

    osveziSeznamPriljubljenih();
});
