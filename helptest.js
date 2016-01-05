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

            $.get(basepath + file + '.textile').success(function (textile) {
                var html = convert(textile);
          //      console.log(html);
                html = rewrite(html);
                $("#pagecontent").html(html);

                $('.page-warnings').addClass('hidden');
                if ($("h1", "#pagecontent").length > 0) {
                    $('#warning-h1').removeClass('hidden');
                }
                var h2Count = $("h2", "#pagecontent").length;
                if (h2Count == 0) {
                    $('#warning-no-h2').removeClass('hidden');
                }
                if (h2Count > 1) {
                    $('#warning-multiple-h2').removeClass('hidden');
                }
                if ($(".shorter", "#pagecontent").length > 0) {
                    $('#warning-no-short').removeClass('hidden');
                }
            }).error(function(jqXHR, textStatus, errorThrown) {
                if ($("#basepath").val().length > 0) {
                    $('#page-not-found-url').text(basepath + file + '.textile');
                    $('#page-not-found').modal('show');
                }
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
