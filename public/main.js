// Views > Home

// Display the input button
function showInput(userId, balance) {
  input = $('#' + userId + 'Input')
  label = $('#' + userId)
  actionName = $('input[name="receipt[action]"]')
  dateName =  $('input[name="receipt[date]"]')
  balanceName = $('input[name="receipt[balance]"]')
  input.removeClass('d-none')
  label.addClass('d-none')

  // Get the Date, Action, and balance
  input.keypress(function (e) {
    var key = (event.keyCode ? event.keyCode : event.which);
    if (key == 13) {
      input.addClass('d-none')
      label.removeClass('d-none')

      action = input.val()
      d = new Date()
      date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()      
      newBalance = balance - action
      // data = [date, action, newBalance]
      // data ={
      //   action: action,
      //   date: date,
      //   balance: newBalance
      // }

      actionName.val(action)
      dateName.val(date)
      balanceName.val(newBalance)

    }
  })
}


// Loads the new page in a modal
$("#addStudent").on("click", function (e) {
  e.preventDefault();
  $("#addStudentModal").modal('show').find('.modal-content').load($(this).attr('href'))
})

// Loads the edit page in a modal 
$(".edit").on("click", function (e) {
  e.preventDefault();
  $("#editStudentModal").modal('show').find('.modal-content').load($(this).attr('href'))
})


// Views > Login 

// Authorization to the home page
$("#submitButton").on("click", function (e) {
  if ('1234' === $("#passcodeInputed").val()) {
    load($(this).attr('href'))
  } else {
    e.preventDefault()
    alert("Wrong Password")
  }
})

// Loads the About page in a modal
$('#aboutPage').on('click', function (e) {
  e.preventDefault();
  $('#aboutPageModal').modal('show').find('.modal-content').load($(this).attr('href'))
})