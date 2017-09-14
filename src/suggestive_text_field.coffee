#= require suggestions_box
#= require wrap
#= require width_of_text

class @SuggestiveTextField
  constructor: (@textInput, @possibleSuggestions, @options = {}) ->
    @defaultOptions {tokenSeparator: ', ', startSuggestingAt: 1}

    @initInternalState()
    @initElements()
    @initEventHandlers()
    @renderSuggestionsBox()

  defaultOptions: (defaultOptions) ->
    @options = Object.assign(defaultOptions, @options)

  # input handling

  onType: ->
    waitOn(@matchingSuggestions @outmostToken()).then (matchingSuggestions) =>
      @offeredSuggestions = matchingSuggestions
      @renderSuggestionsBox()

  onArrow: (shift) ->
    @selectedSuggestionIndex = shiftWithinLimits(@selectedSuggestionIndex, shift, limits: [0, @offeredSuggestions.length-1])

  onHover: (options = {}) ->
    @selectedSuggestionIndex = @offeredSuggestions.indexOf(options.suggestionText)

  onConfirm: ->
    @replaceOutmostTokenWith @selectedSuggestion()
    @offeredSuggestions = []
    @selectedSuggestionIndex = 0

    @options.onConfirmHook? @selectedSuggestion()

  # logic

  initInternalState: ->
    @offeredSuggestions = []
    @selectedSuggestionIndex = 0

  matchingSuggestions: (token) ->
    if token.length > @options.startSuggestingAt
      (@options.suggestionsForToken || @suggestionsForToken).call(this, token)
    else
      []

  suggestionsForToken: (token) ->
    @possibleSuggestions.filter (suggestion) -> suggestion.startsWith(token)

  selectedSuggestion: ->
    @offeredSuggestions[@selectedSuggestionIndex]

  # input/output

  initElements: ->
    container = createElement(
      "<div class='suggestive-container'></div>",
      {position: 'relative'}
    )

    @textInput.autocomplete = 'off'

    @suggestionsBox = new SuggestionsBox(styleFrom: @textInput)

    wrapElement container, around: @textInput
    container.appendChild @suggestionsBox.container

  outmostToken: ->
    if @options.tokenSeparator
      @textInput.value.split(@options.tokenSeparator).pop()
    else
      @textInput.value

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
    @textInput.addEventListener 'input', =>
      @onType()

    @textInput.addEventListener 'keydown', (event) =>
      if event.which == 13 or event.which == 9 or event.which == 39
        @onConfirm()
      else if event.which == 38 # arrow up
        @onArrow(-1)
      else if event.which == 40 # arrow down
        @onArrow(1)
      else
        passThrough = true

      unless passThrough
        @renderSuggestionsBox()
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

waitOn = (value) ->
  promise = if value instanceof Promise then value else Promise.resolve(value)
  