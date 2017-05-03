#= require test_helper
#= require suggestive_text_field

QUnit.module 'SuggestionsBox', beforeEach: ->
  window.textInput = createTextInput()
  window.field = new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'moonlight', 'trap'])
  window.suggestionsBox = field.suggestionsBox

  textInput.value = 'entrapment, mon'
  triggerEvent(textInput, 'input')

QUnit.test 'renders suggestions', (assert) ->
  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity']
  assert.equal suggestionsBox.container.querySelectorAll('.suggestion').length, field.offeredSuggestions.length

QUnit.test 'suggestion selected with mouse', (assert) ->
  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity']
  field.setSelectedSuggestionByText 'monstrosity'
  assert.equal field.selectedSuggestion(), 'monstrosity'