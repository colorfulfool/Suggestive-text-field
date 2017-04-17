(function() {
  var cycleWithin;

  this.SuggestiveTextField = (function() {
    function SuggestiveTextField(textInput, possibleSuggestions) {
      this.textInput = textInput;
      this.possibleSuggestions = possibleSuggestions;
      this.initState();
      this.hookUpEventHandlers();
      this.renderSuggestionsBox();
    }

    SuggestiveTextField.prototype.onType = function() {
      return this.offeredSuggestions = this.matchingSuggestions(this.outmostToken());
    };

    SuggestiveTextField.prototype.onArrow = function(shift) {
      return this.selectedSuggestionIndex = cycleWithin(this.selectedSuggestionIndex + shift, {
        limits: [0, this.offeredSuggestions.length - 1]
      });
    };

    SuggestiveTextField.prototype.onConfirm = function() {
      this.replaceOutmostTokenWith(this.selectedSuggestion());
      return this.offeredSuggestions = [];
    };

    SuggestiveTextField.prototype.initState = function() {
      this.selectedSuggestionIndex = 0;
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
      return this.textInput.value.split(', ').pop();
    };

    SuggestiveTextField.prototype.replaceOutmostTokenWith = function(text) {
      var tokens;
      tokens = this.textInput.value.split(', ').slice(0, -1);
      tokens.push(text);
      return this.textInput.value = tokens.join(', ');
    };

    SuggestiveTextField.prototype.renderSuggestionsBox = function() {
      if (this.offeredSuggestions.length > 0) {
        return console.log(this.offeredSuggestions.join(' '));
      }
    };

    SuggestiveTextField.prototype.hookUpEventHandlers = function() {
      var self;
      self = this;
      this.textInput.addEventListener('input', function() {
        self.onType();
        return self.renderSuggestionsBox();
      });
      return this.textInput.addEventListener('keydown', function(event) {
        if (event.which === 13 || event.which === 9 || event.which === 39) {
          self.onConfirm();
        } else if (event.which === 38) {
          self.onArrow(-1);
        } else if (event.which === 40) {
          self.onArrow(1);
        }
        return self.renderSuggestionsBox();
      });
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
