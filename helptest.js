/**
 * Created by mila on 1/5/16.
 */

$(document).ready(function() {
    $('#settings-form').on("submit", function() {
        $.get($("#basepath").val(), function(textile) {
            $("#pagecontent").html(convert(textile));
        });


        return false;
    });
});
