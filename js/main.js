$(function() {
    search_inp = $(".search-inp");
    search_bar = $(".search-bar");

    search_inp.on("focusin", function() {
        search_bar.addClass("in-focus");
    });
    search_inp.on("focusout", function() {
        search_bar.removeClass("in-focus");
    });
});
