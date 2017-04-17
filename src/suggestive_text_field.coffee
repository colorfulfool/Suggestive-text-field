#= require width_of_text

class @SuggestiveTextField
  constructor: (@textInput, @possibleSuggestions) ->
    @initState()
    @initElements()
    @hookUpEventHandlers()
    @renderSuggestionsBox()

  onType: ->
    @offeredSuggestions = @matchingSuggestions @outmostToken()

  onArrow: (shift) ->
    @selectedSuggestionIndex = cycleWithin(@selectedSuggestionIndex + shift, limits: [0, @offeredSuggestions.length-1])

  onConfirm: ->
    @replaceOutmostTokenWith @selectedSuggestion()
    @offeredSuggestions = []
    @selectedSuggestionIndex = 0

  # logic

  initState: ->
    @selectedSuggestionIndex = 0
    @offeredSuggestions = []

  matchingSuggestions: (token) ->
    return [] if token.length < 1
    @possibleSuggestions.filter (suggestion) -> suggestion.startsWith(token)

  selectedSuggestion: ->
    @offeredSuggestions[@selectedSuggestionIndex]

  # input/output

  initElements: ->
    @suggestionsBox = document.createElement('div')
    @suggestionsBox.style.position = 'absolute'
    @suggestionsBox.style.fontFamily = @textInput.style.fontFamily
    @suggestionsBox.style.fontSize = @textInput.style.fontSize

    outerContainer = @textInput.parentNode
    container = document.createElement('div')
    container.style.position = 'relative'

    container.appendChild @textInput
    container.appendChild @suggestionsBox
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
    if @offeredSuggestions.length > 0
      @suggestionsBox.innerHTML = ''

      for suggestion in @offeredSuggestions
        suggestionDiv = document.createElement('div')
        suggestionDiv.innerHTML = suggestion
        suggestionDiv.style.padding = '2px 5px'
        suggestionDiv.style['background-color'] = '#FFB7B2' if suggestion == @selectedSuggestion()
        @suggestionsBox.appendChild suggestionDiv
      
      @suggestionsBox.style.left = widthOfText @tokensWithoutOutmost().join(', '), style: @textInput
      @suggestionsBox.style.visibility = 'visible'
    else
      @suggestionsBox.style.visibility = 'hidden'

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