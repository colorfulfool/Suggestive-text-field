#= require test_helper
#= require suggestive_text_field

QUnit.module 'SuggestionsBox', beforeEach: ->
  window.textInput = createTextInput()
  window.field = new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'moonlight', 'trap'])
  window.suggestionsBox = field.suggestionsBox

QUnit.test 'renders suggestions', (assert) ->
  textInput.value = 'entrapment, mon'
  triggerEvent(textInput, 'input')

  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity']
  assert.equal suggestionsBox.container.querySelectorAll('.suggestion').length, field.offeredSuggestions.length