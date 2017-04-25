#= require suggestions_box

class @SuggestiveTextField
  constructor: (@textInput, @possibleSuggestions) ->
    @initInternalState()
    @initElements()
    @hookUpEventHandlers()
    @renderSuggestionsBox()

  onType: ->
    @offeredSuggestions = @matchingSuggestions @outmostToken()

  onArrow: (shift) ->
    @selectedSuggestionIndex = cycleWithin(@selectedSuggestionIndex, shift, limits: [0, @offeredSuggestions.length-1])

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
    outerContainer = @textInput.parentNode
    container = document.createElement('div')
    container.style.position = 'relative'

    @suggestionsBox = new SuggestionsBox(styleFrom: @textInput)

    container.appendChild @textInput
    container.appendChild @suggestionsBox.element()
    outerContainer.appendChild container

  outmostToken: ->
    @textInput.value.split(', ').pop()

  tokensWithoutOutmost: ->
    @textInput.value.split(', ').slice(0, -1)

  replaceOutmostTokenWith: (text) ->
    tokens = @tokensWithoutOutmost()
    tokens.push(text)
    @textInput.value = tokens.join(', ')

  renderSuggestionsBox: ->
    @suggestionsBox.renderFor(this)

  # wiring

  hookUpEventHandlers: ->
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
      self.renderSuggestionsBox()


cycleWithin = (initialValue, shift, options) ->
  [min, max] = options.limits
  attemptedValue = initialValue + shift
  if attemptedValue > max
    min
  else if attemptedValue < min
    max
  else
    attemptedValue