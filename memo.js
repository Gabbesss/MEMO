/*
============================================================
                    MEMO.EXE
              MEMORY SEARCH SYSTEM
============================================================
*/

const database = [

    {
        title: "WIKIPEDIA",
        url: "https://pt.wikipedia.org/",
        text:
        "Enciclopedia livre. " +
        "Informacoes sobre ciencia, historia, tecnologia, " +
        "cultura e muitos outros assuntos."
    },

    {
        title: "INTERNET ARCHIVE",
        url: "https://archive.org/",
        text:
        "Biblioteca digital contendo livros, musica, " +
        "videos, software e paginas antigas da internet."
    },

    {
        title: "NASA",
        url: "https://www.nasa.gov/",
        text:
        "Informacoes sobre astronomia, espaco, " +
        "planetas, estrelas e missoes espaciais."
    },

    {
        title: "GITHUB",
        url: "https://github.com/",
        text:
        "Projetos de software, programacao, codigo " +
        "fonte e desenvolvimento."
    },

    {
        title: "MDN WEB DOCS",
        url: "https://developer.mozilla.org/",
        text:
        "Documentacao sobre HTML, CSS, JavaScript " +
        "e tecnologias da Web."
    }

];

let history =
    JSON.parse(
        localStorage.getItem("memo_history") || "[]"
    );

let favorites =
    JSON.parse(
        localStorage.getItem("memo_favorites") || "[]"
    );


const input =
    document.getElementById("search");

const screen =
    document.getElementById("screen");

const status =
    document.getElementById("status");


/*
============================================================
SEARCH
============================================================
*/

function search() {

    const query =
        input.value
            .trim()
            .toLowerCase();

    if (!query) {

        write(
            "ERROR: EMPTY QUERY."
        );

        return;
    }


    status.textContent =
        "SEARCHING...";


    history.unshift(query);

    history =
        [...new Set(history)]
            .slice(0, 50);


    localStorage.setItem(
        "memo_history",
        JSON.stringify(history)
    );


    const words =
        query.split(/\s+/);


    const results =
        database

        .map(page => {

            const title =
                page.title.toLowerCase();

            const text =
                page.text.toLowerCase();


            let score = 0;


            for (const word of words) {

                if (
                    title.includes(word)
                ) {
                    score += 20;
                }

                if (
                    text.includes(word)
                ) {
                    score += 5;
                }

            }


            return {
                ...page,
                score
            };

        })

        .filter(
            page => page.score > 0
        )

        .sort(
            (a, b) =>
                b.score - a.score
        );


    showResults(
        results,
        query
    );
}


/*
============================================================
RESULTS
============================================================
*/

function showResults(
    results,
    query
) {

    screen.innerHTML = "";


    write(
        "QUERY: " +
        escapeHtml(query)
    );


    write(
        "RESULTS: " +
        results.length
    );


    write(
        "--------------------------------------------"
    );


    if (!results.length) {

        screen.innerHTML +=
            `<div class="empty">
                NO DATA FOUND IN MEMO INDEX.
            </div>`;

        status.textContent =
            "NO RESULTS";

        return;
    }


    for (
        let i = 0;
        i < results.length;
        i++
    ) {

        const result =
            results[i];


        const favorite =
            favorites.includes(
                result.url
            );


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "result";


        div.innerHTML = `

            <button
                class="result-star"
                onclick="toggleFavorite('${escapeAttr(result.url)}')">

                ${favorite ? "[*]" : "[ ]"}

            </button>

            <span>
                RESULT ${String(i + 1).padStart(2, "0")}
            </span>

            <br>

            <a
                class="result-title"
                href="${escapeAttr(result.url)}"
                target="_blank">

                ${escapeHtml(result.title)}

            </a>

            <div class="result-url">

                ${escapeHtml(result.url)}

            </div>

            <div class="result-text">

                ${escapeHtml(result.text)}

            </div>

        `;


        screen.appendChild(div);
    }


    status.textContent =
        "SEARCH COMPLETE";
}


/*
============================================================
FAVORITES
============================================================
*/

function toggleFavorite(url) {

    if (
        favorites.includes(url)
    ) {

        favorites =
            favorites.filter(
                item => item !== url
            );

    } else {

        favorites.push(url);

    }


    localStorage.setItem(
        "memo_favorites",
        JSON.stringify(favorites)
    );


    search();
}


/*
============================================================
HISTORY
============================================================
*/

function showHistory() {

    screen.innerHTML = "";


    write(
        "MEMO HISTORY"
    );

    write(
        "--------------------------------------------"
    );


    if (!history.length) {

        write(
            "NO HISTORY."
        );

        return;
    }


    history.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "result";


            div.innerHTML =

                `[${String(index + 1)
                    .padStart(2, "0")}] ` +

                escapeHtml(item);


            screen.appendChild(div);

        }
    );


    status.textContent =
        "HISTORY";
}


/*
============================================================
FAVORITES SCREEN
============================================================
*/

function showFavorites() {

    screen.innerHTML = "";


    write(
        "MEMO FAVORITES"
    );

    write(
        "--------------------------------------------"
    );


    const list =
        database.filter(
            page =>
                favorites.includes(
                    page.url
                )
        );


    if (!list.length) {

        write(
            "NO FAVORITES."
        );

        return;
    }


    list.forEach(
        page => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "result";


            div.innerHTML = `

                <button
                    class="result-star"
                    onclick="toggleFavorite('${escapeAttr(page.url)}')">

                    [*]

                </button>

                <a
                    class="result-title"
                    href="${escapeAttr(page.url)}"
                    target="_blank">

                    ${escapeHtml(page.title)}

                </a>

                <div class="result-url">

                    ${escapeHtml(page.url)}

                </div>

            `;


            screen.appendChild(div);

        }
    );


    status.textContent =
        "FAVORITES";
}


/*
============================================================
HOME
============================================================
*/

function home() {

    screen.innerHTML = "";

    input.value = "";

    status.textContent =
        "READY";
}


/*
============================================================
KEYBOARD
============================================================
*/

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            search();

        }

        if (
            event.key === "Escape"
        ) {

            home();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key.toLowerCase()
            === "h"
            &&
            document.activeElement !== input
        ) {

            showHistory();

        }


        if (
            event.key.toLowerCase()
            === "f"
            &&
            document.activeElement !== input
        ) {

            showFavorites();

        }

    }
);


/*
============================================================
UTILITIES
============================================================
*/

function write(text) {

    screen.innerHTML +=
        `<div>${text}</div>`;

}


function escapeHtml(text) {

    return String(text)
        .replace(
            /[&<>"']/g,
            char => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[char])
        );

}


function escapeAttr(text) {

    return String(text)
        .replace(
            /'/g,
            "\\'"
        );

}


/*
============================================================
BOOT
============================================================
*/

setTimeout(
    () => {

        status.textContent =
            "READY";

    },
    800
);
