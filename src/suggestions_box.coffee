#= require delegate_event_handler
#= require vanilla_helpers

class @SuggestionsBox
  constructor: (options) ->
    @container = createElement(
      "<div></div>", {
        position: 'absolute',
        fontFamily: options.styleFrom.style.fontFamily,
        fontSize: options.styleFrom.style.fontSize,
        border: '1px solid #FFB7B2',
        backgroundColor: 'white'
      }
    )

  renderFor: (@context) ->
    if @context.offeredSuggestions.length > 0
      @container.innerHTML = ''

      for suggestion in @context.offeredSuggestions
        @container.appendChild @renderSuggestion(suggestion)
      
      @container.style.left = @context.suggestionBoxLeftMargin()
      @container.style.visibility = 'visible'
    else
      @container.style.visibility = 'hidden'

  renderSuggestion: (suggestion) ->
    suggestionDiv = createElement(
      "<div class='suggestion'>#{@suggestionText suggestion}</div>",
      {
        padding: '2px 5px', 
        cursor: 'pointer'
      }
    )
    
    if suggestion is @context.selectedSuggestion()
      setStyle suggestionDiv, {backgroundColor: '#FFB7B2'}

    @suggestionEventHandlers(suggestionDiv)

    suggestionDiv

  suggestionText: (suggestion) ->
    if suggestion instanceof Object
      suggestion.text
    else
      suggestion

  suggestionEventHandlers: (suggestionDiv) ->
    parentTextField = @context

    suggestionDiv.addEventListener 'mouseenter', ->
      parentTextField.onHover(suggestionText: this.textContent)
      parentTextField.renderSuggestionsBox()

    suggestionDiv.addEventListener 'mousedown', ->
      parentTextField.onConfirm()
      parentTextField.renderSuggestionsBox()
