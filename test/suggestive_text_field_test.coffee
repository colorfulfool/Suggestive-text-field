#= require test_helper
#= require suggestive_text_field

QUnit.module 'SuggestiveTextField', beforeEach: ->
  window.textInput = createTextInput()
  window.field = fieldWithOptions {}

QUnit.test 'user starts with existing token', (assert) ->
  textInput.value = 'mo'
  triggerEvent(textInput, 'input')
  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity', 'moonlight']
  assert.equal field.selectedSuggestion(), 'monster'

  triggerEvent(textInput, 'keydown', 38) # Arrow Up
  assert.equal field.selectedSuggestion(), 'moonlight' # circleWithin limits:

  triggerEvent(textInput, 'keydown', 13) # Enter
  assert.equal textInput.value, 'moonlight'

QUnit.test 'user continues with existing token', (assert) ->
  textInput.value = 'entrapment, mon'
  triggerEvent(textInput, 'input')
  assert.equal field.outmostToken(), 'mon'
  assert.deepEqual field.offeredSuggestions, ['monster', 'monstrosity']
  assert.equal field.selectedSuggestion(), 'monster'

  triggerEvent(textInput, 'keydown', 13) # Enter
  assert.equal textInput.value, 'entrapment, monster'

QUnit.test 'developer has overridden suggestionsForToken', (assert) ->
  window.field = fieldWithOptions {
    suggestionsForToken: (token) ->
      ["#{token}re", "#{token}st", "the #{token}st"]
  }

  textInput.value = 'mo'
  triggerEvent(textInput, 'input')
  assert.deepEqual field.offeredSuggestions, ['more', 'most', 'the most']
  assert.equal field.selectedSuggestion(), 'more'