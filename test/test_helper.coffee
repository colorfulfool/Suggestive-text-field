@createTextInput = ->
  input = document.createElement('input')
  input.type = 'text'
  input

@triggerEvent = (element, eventName, keyCode = undefined) ->
  event = new CustomEvent(eventName)
  event.which = keyCode
  element.dispatchEvent(event)