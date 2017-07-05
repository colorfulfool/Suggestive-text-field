#= require suggestions_box
#= require wrap
#= require width_of_text

class @SuggestiveTextField
  constructor: (@textInput, @possibleSuggestions) ->
    @initInternalState()
    @initElements()
    @initEventHandlers()
    @renderSuggestionsBox()

  onType: ->
    @offeredSuggestions = @matchingSuggestions @outmostToken()

  onArrow: (shift) ->
    @selectedSuggestionIndex = shiftWithinLimits(@selectedSuggestionIndex, shift, limits: [0, @offeredSuggestions.length-1])

  onHover: (options = {}) ->
    @selectedSuggestionIndex = @offeredSuggestions.indexOf(options.suggestionText)

  onConfirm: ->
    @replaceOutmostTokenWith @selectedSuggestion()
    @offeredSuggestions = []
    @selectedSuggestionIndex = 0

  # logic

  initInternalState: ->
    @offeredSuggestions = []
    @selectedSuggestionIndex = 0

  matchingSuggestions: (token) ->
    return [] if token.length < 1
    @possibleSuggestions.filter (suggestion) -> suggestion.startsWith(token)

  selectedSuggestion: ->
    @offeredSuggestions[@selectedSuggestionIndex]

  # input/output

  initElements: ->
    container = document.createElement('div')
    container.className = 'suggestive-container'
    container.style.position = 'relative'

    @textInput.autocomplete = 'off'

    @suggestionsBox = new SuggestionsBox(styleFrom: @textInput)

    wrap container, around: @textInput
    container.appendChild @suggestionsBox.container

  outmostToken: ->
    @textInput.value.split(', ').pop()

  valueWithoutOutmostToken: ->
    @textInput.value.slice(0, -1 * @outmostToken().length)

  replaceOutmostTokenWith: (text) ->
    @textInput.value = @valueWithoutOutmostToken() + text

  renderSuggestionsBox: ->
    @suggestionsBox.renderFor(this)

  suggestionBoxLeftMargin: ->
    widthOfText(@valueWithoutOutmostToken(), style: @textInput)

  # wiring

  initEventHandlers: ->
    self = @
    @textInput.addEventListener 'input', -> 
      self.onType()
      self.renderSuggestionsBox()

    @textInput.addEventListener 'keydown', (event) ->
      if event.which == 13 or event.which == 9 or event.which == 39
        self.onConfirm()
      else if event.which == 38 # arrow up
        self.onArrow(-1)
      else if event.which == 40 # arrow down
        self.onArrow(1)
      else
        passThrough = true

      unless passThrough
        self.renderSuggestionsBox()
        event.preventDefault()
        event.stopPropagation()

shiftWithinLimits = (initialValue, shift, options) ->
  [min, max] = options.limits
  attemptedValue = initialValue + shift
  if attemptedValue > max
    min
  else if attemptedValue < min
    max
  else
    attemptedValue