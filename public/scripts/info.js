$(document).ready(function() {
  console.log("JS is connected!");

  $('#showInfo').on('click', function(e) {
    e.preventDefault();
    $('#infoModal').modal('show');
  });

});
