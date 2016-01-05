/**
 * Created by mila on 1/5/16.
 */

$(document).ready(function() {
    $("a.url-template").click(function() {
        $("#basepath").val($(this).attr('href'));
        return false;
    });

    $('#settings-form').on("submit", function() {
        var file = $("#filepath").val();
        if (file.length) {
            location.hash = 'f=' + file;
        }

        $(window).hashchange();
        return false;
    });


    $(window).hashchange(function(){
        var hash = location.hash || '#f=index';
        var hashFile =  hash.replace( /^#f=/, 'f=' );

        if (hashFile.startsWith('f=')) {
            var file = hash.replace(/^#f=/, '');

            $("#filepath").val(file);

            var basepath = $("#basepath").val();
            if (!basepath.endsWith('/')) {
                basepath += '/';
            }

            $.get(basepath + file + '.textile', function (textile) {
                var html = convert(textile);
          //      console.log(html);
                html = rewrite(html);
                $("#pagecontent").html(html);
            });
        }
    });
    $(window).hashchange();
});

$(window).load(function(){
    $('#info').modal('show');
});

function rewrite(htmlString) {
    var basepath = $("#basepath").val();
    if (!basepath.endsWith('/')) {
        basepath += '/';
    }

    var html = $(htmlString);
    // Links
    $('a', html).each(function(index, element) {
        var jElement = $(element);
        if (jElement.attr('href').startsWith('help?f=')) {
            jElement.attr('href', '#' + jElement.attr('href').substring(5));
        }
    });

    // Images
    $('img', html).each(function(index, element) {
        var jElement = $(element);
        if (jElement.attr('src').startsWith('help?f=')) {
            jElement.attr('src', basepath + jElement.attr('src').substring(7));
        }
    });
    return html;
}
