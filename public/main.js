// Views > Partials > Header

// Views >  Partials > Footer

// Views > About 

// Views > Home

// Views > Login 

$("#submitButton").on("click", function (e) {
  if ('1234' === $("#passcodeInputed").val()) {
    load($(this).attr('href'))
  } else {
    e.preventDefault()
    alert("Wrong Password")
  }
})

// To show the modal for about page
$('#aboutPage').on('click', function (e) {
  e.preventDefault();
  $('#aboutPageModal').modal('show').find('.modal-content').load($(this).attr('href'))
})

// Views > Shows 