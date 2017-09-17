# Suggestive Text Field
The most basic autocomplete input on the web. Comes as a single JS file that doesn't depend on anything.

```javascript
  textInput = document.querySelector('input[name=tags]')
  new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'trap'])
```

![demonstration](http://i64.tinypic.com/j0i8w2.gif)

### Okay, but my autocomplete needs to fetch the suggestions from the web

```coffeescript
new SuggestiveTextField(textInput, null,
  suggestionsForToken: (token) ->
  
    new Promise (resolve, reject) ->
      remoteJSON "http://api.cdek.ru/city/jsonp.php?name_startsWith=#{token}", (response) ->
        resolve response.locations.map (location) -> location.cityName
        
)
```
More details right below. `remoteJSON` is a jQuery-free replacement for `$.getJSON()` from [a StackOverflow post](https://stackoverflow.com/a/22780569/2156614).

## Options

```javascript
SuggestiveTextField(textInput, suggestions, {

  tokenSeparator: ', ', // or pass false to disallow multiple selections
  
  // Pass your own functions as hooks to alter the behaviour:
  
  suggestionsForToken: function (token) {
    // return suggestions that start with `token`
  },
  onConfirmHook: function (selectedSuggestion) {
    // do something extra when a suggestion is selected
  }
})
```

## Development

`blade runner` to run the tests in the browser<br>
`blade build` to re-compile the `dist/`
