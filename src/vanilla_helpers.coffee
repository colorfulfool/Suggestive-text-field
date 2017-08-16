setStyle = (element, properties) ->
  Object.assign(element.style, properties)

@createElement = (html, style) ->
  div = document.createElement('div')
  div.innerHTML = html
  generated = div.firstChild
  setStyle(generated, style) if style?
  return generated