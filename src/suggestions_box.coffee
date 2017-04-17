#= require width_of_text

class @SuggestionsBox
  constructor: (options) ->
    @box = document.createElement('div')
    @box.style.position = 'absolute'
    @box.style.fontFamily = options.styleFrom.style.fontFamily
    @box.style.fontSize = options.styleFrom.style.fontSize

  element: ->
    @box

  renderFor: (context) ->
    if context.offeredSuggestions.length > 0
      @box.innerHTML = ''

      for suggestion in context.offeredSuggestions
        suggestionDiv = document.createElement('div')
        suggestionDiv.innerHTML = suggestion
        suggestionDiv.style.padding = '2px 5px'
        
        if suggestion == context.selectedSuggestion()
          suggestionDiv.style.backgroundColor = '#FFB7B2'
        @box.appendChild suggestionDiv
      
      @box.style.left = widthOfText context.tokensWithoutOutmost().join(', '), style: @box
      @box.style.visibility = 'visible'
    else
      @box.style.visibility = 'hidden'