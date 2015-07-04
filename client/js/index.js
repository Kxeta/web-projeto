 var login = $("#form-login");
login.submit(function( event ) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/app"
    });
});