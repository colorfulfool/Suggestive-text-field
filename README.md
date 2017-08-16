# Suggestive Text Field
The most basic autocomplete input on the web. Comes as a single JS file, doesn't depend on anything.

```javascript
  textInput = document.querySelector('input[name=tags]')
  new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'trap'])
```

![demonstration](http://i64.tinypic.com/j0i8w2.gif)

### Options

```javascript
new SuggestiveTextField(textInput, suggestions, {tokenSeparator: ', '})
```

Pass your own `tokenSeparator` to override or pass `false` to disallow choosing multiple suggestions.

## Development

`blade runner` to run the tests in the browser<br>
`blade build` to re-compile the `dist/`

![Idea](http://i64.tinypic.com/rva636.png)
