(function() {
  var SuggestiveTextField, cycleWithin;

  SuggestiveTextField = (function() {
    function SuggestiveTextField(textInput, possibleSuggestions) {
      this.textInput = textInput;
      this.possibleSuggestions = possibleSuggestions;
      hookUpEventHandlers();
    }

    SuggestiveTextField.prototype.onType = function() {
      return this.offeredSuggestions = matchingSuggestions(outmostToken());
    };

    SuggestiveTextField.prototype.onArrow = function(shift) {
      return this.selectedSuggestionIndex = cycleWithin(this.selectedSuggestionIndex + shift, {
        limits: [0, this.offeredSuggestions.length - 1]
      });
    };

    SuggestiveTextField.prototype.onConfirm = function() {
      replaceOutmostTokenWith(selectedSuggestion());
      return this.offeredSuggestions = [];
    };

    SuggestiveTextField.prototype.matchingSuggestions = function(token) {
      if (token.length < 2) {
        return [];
      }
      return this.possibleSuggestions.filter(function(suggestion) {
        return suggestion.startsWith(token);
      });
    };

    SuggestiveTextField.prototype.selectedSuggestion = function() {
      return this.offeredSuggestions[this.selectedSuggestionIndex];
    };

    SuggestiveTextField.prototype.outmostToken = function() {
      return this.textInput.value.split(', ')[-1];
    };

    SuggestiveTextField.prototype.replaceOutmostTokenWith = function(text) {
      return this.textInput.value(valueWithoutOutmost + text);
    };

    SuggestiveTextField.prototype.renderSuggestionsBox = function(suggestions) {
      var j, len, results, text;
      resetSuggestionBox();
      results = [];
      for (j = 0, len = suggestions.length; j < len; j++) {
        text = suggestions[j];
        results.push(this.suggestionBox.insert(span(text, {
          "class": i === this.selectedSuggestionIndex && 'selected'
        })));
      }
      return results;
    };

    SuggestiveTextField.prototype.resetSuggestionBox = function() {
      this.selectedSuggestionIndex = 0;
      return this.suggestionBox.remove();
    };

    SuggestiveTextField.prototype.hookUpEventHandlers = function() {
      return handleEvent(this.textInput, 'input', onType);
    };

    return SuggestiveTextField;

  })();

  cycleWithin = function(attemptedValue, options) {
    var max, min, ref;
    ref = options.limits, min = ref[0], max = ref[1];
    if (attemptedValue > max) {
      return min;
    } else if (attemptedValue < min) {
      return max;
    } else {
      return attemptedValue;
    }
  };

}).call(this);
