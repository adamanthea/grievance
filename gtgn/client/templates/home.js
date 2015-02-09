Template.home.events({
    "click a.carousel.right": function (e) {
        e.preventDefault();
        var $next = $('.carousel.content.visible').removeClass('visible').next('.carousel.content');
        if ($next.length) {
            $next.addClass('visible');
        } else {
            $(".carousel.content:first").addClass('visible');
        }
    },
    "click a.carousel.left": function (e) {
        e.preventDefault();
        var $next = $('.carousel.content.visible').removeClass('visible').prev('.carousel.content');
        if ($next.length) {
            $next.addClass('visible');
        } else {
            $(".carousel.content:last").addClass('visible');
        }
    }
});
