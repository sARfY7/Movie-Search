$(function() {
    APIKEY = "7e2527157403475bc563990b80915c14";
    SEARCHURL =
        "https://api.themoviedb.org/3/search/movie?api_key=" +
        APIKEY +
        "&language=en-US&page=1&include_adult=false&query=";
    const CONFIGURL =
        "https://api.themoviedb.org/3/configuration?api_key=" + APIKEY;
    MOVIEURL = "https://api.themoviedb.org/3/movie/";

    CONFIG = null;

    search_inp = $(".search-inp");
    search_bar = $(".search-bar");
    search_result = $(".search-result");

    search_inp.on("focusin", function() {
        search_bar.addClass("in-focus");
    });
    search_inp.on("focusout", function() {
        search_bar.removeClass("in-focus");
    });

    const settings = {
        async: true,
        crossDomain: true,
        url: CONFIGURL,
        method: "GET",
        headers: {},
        data: "{}"
    };

    $.ajax(settings).done(function(response) {
        CONFIG = response;
    });
});

function getMovies(element) {
    if (element.value == "") {
        search_result.html("");
        return;
    }

    let inpValBeforeSend;
    const settings = {
        async: true,
        crossDomain: true,
        url: SEARCHURL + element.value,
        method: "GET",
        headers: {},
        data: "{}",
        beforeSend: function() {
            inpValBeforeSend = element.value;
        }
    };

    $.ajax(settings).done(function(response) {
        const currentInpVal = element.value;
        if (currentInpVal == inpValBeforeSend) {
            search_result.html("");
            const movies = response.results.slice(0, 5);
            movies.forEach(movie => {
                const movieCard = createMovieCard(movie);
                search_result.append(movieCard);
            });
        }
    });
}

function createMovieCard(movie) {
    const a = $("<a>", {
        href: MOVIEURL + movie.id + "?api_key=" + APIKEY + "&language=en-US"
    });
    const search_result_card = $("<div>", { class: "search-result-card" });
    const search_result_card_poster = $(
        "<div class='search-result-card__poster'></div>"
    );
    const search_result_card_content = $(
        "<div class='search-result-card__content'></div>"
    );
    const search_result_card_name = $(
        "<div class='search-result-card__name'></div>"
    );
    const search_result_card_year = $(
        "<div class='search-result-card__year'></div>"
    );
    const search_result_card_rating = $(
        "<div class='search-result-card__rating'></div>"
    );
    const search_result_card_rating_number = $(
        "<div class='search-result-card__rating-number'></div>"
    );
    search_result_card_poster.append(
        "<img src=" +
            CONFIG.images.secure_base_url +
            CONFIG.images.poster_sizes[0] +
            movie.poster_path +
            " alt=" +
            movie.title +
            " />"
    );
    search_result_card_name.append(movie.title);
    search_result_card_year.append(movie.release_date.split("-")[0]);
    search_result_card_rating_number.append(movie.vote_average);
    search_result_card_rating.append(
        '<img class="search-result-card__rating-icon" src="img/icons/star.svg" alt="Rating"/>'
    );
    search_result_card_rating.append(search_result_card_rating_number);
    search_result_card_content.append(search_result_card_name);
    search_result_card_content.append(search_result_card_year);
    search_result_card_content.append(search_result_card_rating);
    search_result_card.append(search_result_card_poster);
    search_result_card.append(search_result_card_content);
    a.append(search_result_card);
    return a;
}
