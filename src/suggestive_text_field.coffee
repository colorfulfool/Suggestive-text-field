class @SuggestiveTextField
  constructor: (@textInput, @possibleSuggestions) ->
    @initState()
    @hookUpEventHandlers()
    @renderSuggestionsBox()

  onType: ->
    @offeredSuggestions = @matchingSuggestions @outmostToken()

  onArrow: (shift) ->
    @selectedSuggestionIndex = cycleWithin(@selectedSuggestionIndex + shift, limits: [0, @offeredSuggestions.length-1])

  onConfirm: ->
    @replaceOutmostTokenWith @selectedSuggestion()
    @offeredSuggestions = []

  # logic

  initState: ->
    @selectedSuggestionIndex = 0
    @offeredSuggestions = []

  matchingSuggestions: (token) ->
    return [] if token.length < 2
    @possibleSuggestions.filter (suggestion) -> suggestion.startsWith(token)

  selectedSuggestion: ->
    @offeredSuggestions[@selectedSuggestionIndex]

  # input/output

  outmostToken: ->
    @textInput.value.split(', ').pop()

  replaceOutmostTokenWith: (text) ->
    tokens = @textInput.value.split(', ').slice(0, -1)
    tokens.push(text)
    @textInput.value = tokens.join(', ')

  renderSuggestionsBox: ->
    if @offeredSuggestions.length > 0
      console.log @offeredSuggestions.join(' ')

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


cycleWithin = (attemptedValue, options) ->
  [min, max] = options.limits
  if attemptedValue > max
    min
  else if attemptedValue < min
    max
  else
    attemptedValue