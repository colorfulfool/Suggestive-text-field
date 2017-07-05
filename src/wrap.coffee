@wrapElement = (wrapper, options) ->
  toWrap = options['around']
  wrapper = wrapper or document.createElement('div')
  if toWrap.nextSibling
    toWrap.parentNode.insertBefore wrapper, toWrap.nextSibling
  else
    toWrap.parentNode.appendChild wrapper
  wrapper.appendChild toWrap