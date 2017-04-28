@widthOfText = (text, options) ->
  calculateWidthForText(text, options.style) + 'px'

calculateWidthForText = (text, parent) ->
  if spacer == undefined
    # on first call only.
    spacer = document.createElement('span')
    spacer.style.visibility = 'hidden'
    spacer.style.position = 'fixed'
    spacer.style.outline = '0'
    spacer.style.margin = '0'
    spacer.style.padding = parent.style.padding
    spacer.style.border = '0'
    spacer.style.left = '0'
    spacer.style.whiteSpace = 'pre'
    spacer.style.fontSize = parent.style.fontSize
    spacer.style.fontFamily = parent.style.fontFamily
    spacer.style.fontWeight = 'normal'
    document.body.appendChild spacer
  # Used to encode an HTML string into a plain text.
  # taken from http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
  spacer.innerHTML = String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  spacer.getBoundingClientRect().right