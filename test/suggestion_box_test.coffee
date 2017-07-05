#= require test_helper
#= require suggestive_text_field

QUnit.module 'SuggestionsBox', beforeEach: ->
  window.textInput = createTextInput()
  window.field = new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'moonlight', 'trap'])
  window.suggestionsBox = field.suggestionsBox

  textInput.value = 'entrapment, mon'
  triggerEvent textInput, 'input'
  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity']

QUnit.test 'renders suggestions', (assert) ->
  assert.equal suggestionsBox.container.querySelectorAll('.suggestion').length, field.offeredSuggestions.length

QUnit.test 'suggestion selected with mouse', (assert) ->
  secondSuggestion = suggestionsBox.container.querySelectorAll('.suggestion')[1]
  triggerEvent secondSuggestion, 'mouseenter'
  triggerEvent secondSuggestion, 'mousedown'

  assert.equal textInput.value, 'entrapment, monstrosity'