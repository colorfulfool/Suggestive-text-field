@createTextInput = ->
  input = document.createElement('input')
  input.type = 'text'

  parent = document.createElement('div')
  parent.appendChild(input)
  input

@triggerEvent = (element, eventName, keyCode = undefined) ->
  event = new CustomEvent(eventName)
  event.which = keyCode
  element.dispatchEvent(event)

@fieldWithOptions = (options = {}) ->
  new SuggestiveTextField(
    textInput, ['monster', 'monstrosity', 'moonlight', 'trap'], options)