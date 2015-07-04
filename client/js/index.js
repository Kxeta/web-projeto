$(document).ready(function () {
    var login = $("#form-login");
    login.submit(function( event ) {
        event.preventDefault();
        $.ajax({
          type: "GET",
          url: "/app"
        });
    });
});