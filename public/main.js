// Change the active class based on url
$(document).ready(function () {
  $('li.active').removeClass('active');
  $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
});

// Views > show > pagination
function pageTab(rowsTotal) {
  rowsShown = 5
  numPages = rowsTotal / rowsShown
  for (i = 0; i < numPages; i++) {
    pageNum = i + 1
    $("#pages").append('<li class="page-item"><a class="page-link" href="#" rel="' + i + '">' + pageNum + '</a></li>')
  }
  $("#table tbody tr").hide()
  $("#table tbody tr").slice(0, rowsShown).show()
  $('#pages li:first').addClass('active')
  $('#pages a').bind('click', function () {
    $("#pages li").removeClass('active')
    $(this).closest('li').addClass('active')
    currPage = $(this).attr('rel')
    startItem = currPage * rowsShown
    endItem = startItem + rowsShown
    $('#table tbody tr').hide().slice(startItem, endItem).show()
  })
}

// Display the input button
function showInput(userId, balance) {
  // Prepare the necessary variables
  label = $('#' + userId)
  input = $('#' + userId + 'Input')
  dateName = $('input[name="receipt[date]"]')
  actionName = $('input[name="receipt[action]"]')
  balanceName = $('input[name="receipt[balance]"]')
  actionSign = $('input[name="receipt[actionSign]"]')
  newBalance = 0

  // Show the input and hide label
  input.removeClass('d-none')
  label.addClass('d-none')

  // hide input when whitespace is clicked
  $('body').click(function (e) {
    if (e.target == this) {
      input.addClass('d-none')
      label.removeClass('d-none')
    }
  })


  // When enter key is pressed
  input.keypress(function (e) {
    var key = (event.keyCode ? event.keyCode : event.which);
    if (key == 13) {
      // hide the input and show the label
      input.addClass('d-none')
      label.removeClass('d-none')

      // Take appropriate action
      action = input.val()
      check = action.indexOf("+")
      if (check != -1) {
        action = action.slice(1)
        action = Number(action)
        balance = Number(balance)
        newBalance = balance + action
        actionSigned = '+'
      } else {
        action = Number(action)
        balance = Number(balance)
        if (!action) {
          $(".message").addClass('alert alert-danger')
            .html('Please Insert A Number').delay(2000).slideUp(1000);
          $('#' + userId + 'form').submit(function (e) {
            input.val("")
            e.stopImmediatePropagation();
            e.preventDefault();
          })
        } else {
          newBalance = balance - action
          actionSigned = '-'
        }

      }

      // Get Today's Date
      d = new Date()
      date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()

      // Check errors if any
      if (newBalance < 0) {
        $(".message").addClass('alert alert-danger')
          .html("Get more money").delay(2000).slideUp(1000);
        setTimeout(() => {
          location.reload(true);
        }, 3000)
        $('#' + userId + 'form').submit(function (e) {
          input.val("")
          e.stopPropagation();
          e.preventDefault();
          // Make page reload
        })
      } else if (action == 0) {
        setTimeout(() => {
          location.reload(true);
          $(".message").addClass('alert alert-danger')
            .html('Please Insert More Than Zero').delay(2000).slideUp(1000);
        }, 3000);
        $('#' + userId + 'form').submit(function (e) {
          input.val("")
          e.stopPropagation();
          e.preventDefault();
        })
      } else {

        // Send data to the server
        dateName.val(date)
        balanceName.val(newBalance)
        actionName.val(action)
        actionSign.val(actionSigned)
      }
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

// Load modal to update user information from header
$("#UpdateUser").on("click", function (e) {
  e.preventDefault();
  $(".UpdateUserModal").modal('show').find('.modal-content').load($(this).attr('href'))
})
$(".UpdateUserModal").on('hidden.bs.modal', function(e){
  location.reload(true);
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

$('.deleteBtn').on('click', function (e) {
  e.preventDefault();
  $('#deleteConfig').modal('show').find('.modal-content').load($(this).attr('href'))
})