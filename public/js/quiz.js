function startQuiz() {
  $('#quiz').load('/quizstart');
}

function quizAnswer(form) {
  // var result = $('quiz_result').val()

  // $('#quiz').load('/quiz', $('#quiz_form').serialize())
  $.post('/quiz', $('#quiz_form').serialize(), function(data, textStatus, xhr){
    $('#quiz').html(data)
  })

  return false
}
