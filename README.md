# Suggestive Text Field
The most basic autocomplete input on the web. Comes as a single JS file that doesn't depend on anything.

```javascript
  textInput = document.querySelector('input[name=tags]')
  new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'trap'])
```

![demonstration](http://i64.tinypic.com/j0i8w2.gif)

### Options

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
