$(function () {
    /*公共部分
     * header 头部
     * footer CopyRight
     */
    $(".header_page").load("../../template/header.html");
    $(".footer_page").load("../../template/footer.html");
    $('#tab1 > li').on("click", function () {
        var num = $(this).index();
        $('#tab1 > li').each(function () {
            if ($(this).index() == num) {
                $(this).attr("class", "li current");
            } else {
                $(this).attr("class", "li");
            }
        });
    });
    $('#tab2 > li').on("click", function () {
        var num = $(this).index();
        $('#tab2 > li').each(function () {
            if ($(this).index() == num) {
                $(this).attr("class", "li current");
            } else {
                $(this).attr("class", "li");
            }
        });
    });
    $('#tab3 > li').on("click", function () {
        var num = $(this).index();
        $('#tab3 > li').each(function () {
            if ($(this).index() == num) {
                $(this).attr("class", "li current");
            } else {
                $(this).attr("class", "li");
            }
        });
    });
    $('#tab4 > li').on("click", function () {
        var num = $(this).index();
        $('#tab3 > li').each(function () {
            if ($(this).index() == num) {
                $(this).attr("class", "li current");
            } else {
                $(this).attr("class", "li");
            }
        });
    });

});