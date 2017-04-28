# Suggestive Text Field
The most basic autocomplete input on the web. It's a single JS file that doesn't depend on anything.

```javascript
  textInput = document.querySelector('[name=tags]')
  new SuggestiveTextField(textInput, ['monster', 'monstrosity', 'trap'])
```

![Idea](http://i64.tinypic.com/rva636.png)

## Development

`blade runner` to run the tests in the browser<br>
`blade build` to re-compile the `dist/`
