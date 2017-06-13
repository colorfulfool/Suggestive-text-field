#= require delegate_event_handler

class @SuggestionsBox
  constructor: (options) ->
    @container = document.createElement('div')
    @container.style.position = 'absolute'
    @container.style.fontFamily = options.styleFrom.style.fontFamily
    @container.style.fontSize = options.styleFrom.style.fontSize
    @container.style.border = '1px solid #FFB7B2'
    @container.style.backgroundColor = 'white'

  renderFor: (@context) ->
    if @context.offeredSuggestions.length > 0
      @container.innerHTML = ''

      for suggestion in @context.offeredSuggestions
        @container.appendChild @renderSuggestion(suggestion)
      
      @container.style.left = @context.suggestionBoxLeftShift()
      @container.style.visibility = 'visible'
    else
      @container.style.visibility = 'hidden'

  renderSuggestion: (text) ->
    suggestionDiv = document.createElement('div')
    suggestionDiv.className = 'suggestion'
    suggestionDiv.innerHTML = text
    suggestionDiv.style.padding = '2px 5px'
    suggestionDiv.style.cursor = 'pointer'
    
    if text == @context.selectedSuggestion()
      suggestionDiv.style.backgroundColor = '#FFB7B2'

    @suggestionEventHandlers suggestionDiv

    suggestionDiv

  suggestionEventHandlers: (suggestionDiv) ->
    parentTextField = @context

    suggestionDiv.addEventListener 'mouseenter', ->
      parentTextField.onHover(suggestionText: this.textContent)
      parentTextField.renderSuggestionsBox()

    suggestionDiv.addEventListener 'mousedown', ->
      parentTextField.onConfirm()
      parentTextField.renderSuggestionsBox()
