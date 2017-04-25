#= require width_of_text

class @SuggestionsBox
  constructor: (@context, options) ->
    @container = document.createElement('div')
    @container.style.position = 'absolute'
    @container.style.fontFamily = options.styleFrom.style.fontFamily
    @container.style.fontSize = options.styleFrom.style.fontSize
    @container.style.border = '1px solid #FFB7B2'

  render: ->
    if @context.offeredSuggestions.length > 0
      @container.innerHTML = ''

      for suggestion in @context.offeredSuggestions
        @container.appendChild @renderSuggestion(suggestion)
      
      @container.style.left = widthOfText(@context.tokensWithoutOutmost().join(', '), style: @container)
      @container.style.visibility = 'visible'
    else
      @container.style.visibility = 'hidden'

  renderSuggestion: (text) ->
    suggestionDiv = document.createElement('div')
    suggestionDiv.innerHTML = text
    suggestionDiv.style.padding = '2px 5px'
    
    if text == @context.selectedSuggestion()
      suggestionDiv.style.backgroundColor = '#FFB7B2'

    suggestionDiv

  element: ->
    @container