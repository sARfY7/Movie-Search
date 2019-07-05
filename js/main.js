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

    backdrop_container = $(".backdrop-container");
    backdrop_overlay = $(".backdrop-overlay");
    backdrop_movie_genre = $(".backdrop-movie__genre ul");
    backdrop_movie_director = $(".backdrop-movie__director ul");
    backdrop_movie_cast = $(".backdrop-movie__cast ul");
    backdrop_movie_name = $(".backdrop-movie__name");
    backdrop_movie_overview = $(".backdrop-movie__overview");
    backdrop_movie_rating = $(".backdrop-movie__rating");
    go_back = $(".go-back");

    search_inp.on("focusin", function() {
        search_bar.addClass("in-focus");
    });
    search_inp.on("focusout", function() {
        search_bar.removeClass("in-focus");
    });

    go_back.on("click", function() {
        search_inp.focus();
        backdrop_container.css("background-image", "url()");
        backdrop_movie_genre.html("");
        backdrop_movie_cast.html("");
        backdrop_movie_director.html("");
        backdrop_movie_name.html("");
        backdrop_movie_overview.html("");
        backdrop_movie_rating.html("");
        $("#detail").css("display", "none");
    });

    $(window).on("load", function() {
        search_inp.focus();
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

    search_result.html("");
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
            const movies = response.results.slice(0, 5);
            movies.forEach(movie => {
                const movieCard = createMovieCard(movie);
                search_result.append(movieCard);
            });
        }
    });
}

function createMovieCard(movie) {
    const search_result_card = $("<div>", {
        class: "search-result-card",
        onclick: "getMovieDetails(" + movie.id + ")"
    });
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
    return search_result_card;
}

function getMovieDetails(movie_id) {
    showSpinner();
    const settings = {
        async: true,
        crossDomain: true,
        url:
            MOVIEURL +
            movie_id +
            "?api_key=" +
            APIKEY +
            "&language=en-US&append_to_response=credits",
        method: "GET",
        headers: {},
        data: "{}"
    };

    $.ajax(settings).done(function(response) {
        search_result.html("");
        search_inp.val("");
        backdrop_movie_genre.html("");
        backdrop_movie_cast.html("");
        backdrop_movie_director.html("");
        backdrop_movie_name.html("");
        backdrop_movie_overview.html("");
        backdrop_movie_rating.html("");
        loadBackdropImage(response);
        response.genres.forEach(genre => {
            backdrop_movie_genre.append("<li>" + genre.name + "</li>");
        });
        backdrop_movie_name.append(response.title);
        response.credits.crew.forEach(crew => {
            if (crew.job == "Director") {
                backdrop_movie_director.append("<li>" + crew.name + "</li>");
            }
        });
        response.credits.cast.slice(0, 5).forEach(cast => {
            backdrop_movie_cast.append("<li>" + cast.name + "</li>");
        });
        backdrop_movie_overview.append(response.overview);
        backdrop_movie_rating.append(response.vote_average);
        $("#detail").css("display", "block");
    });
}

function showSpinner() {
    $(".spinner-container").css("display", "flex");
}

function hideSpinner() {
    $(".spinner-container").css("display", "none");
}

function loadBackdropImage(response) {
    $("<img/>")
        .attr(
            "src",
            CONFIG.images.secure_base_url +
                CONFIG.images.backdrop_sizes[2] +
                response.backdrop_path
        )
        .on("load", function() {
            $(this).remove();
            backdrop_container.css(
                "background-image",
                "url(" +
                    CONFIG.images.secure_base_url +
                    CONFIG.images.backdrop_sizes[2] +
                    response.backdrop_path +
                    ")"
            );
            anime({
                targets: ".backdrop-container",
                opacity: 1,
                scale: [1.1, 1],
                duration: 400,
                easing: "easeOutQuad",
                begin: hideSpinner()
            });
        });
}
