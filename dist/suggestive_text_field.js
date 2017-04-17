(function() {
  var calculateWidthForText;

  this.widthOfText = function(text, options) {
    return calculateWidthForText(text, options.style) + 'px';
  };

  calculateWidthForText = function(text, parent) {
    var spacer;
    if (spacer === void 0) {
      spacer = document.createElement('span');
      spacer.style.visibility = 'hidden';
      spacer.style.position = 'fixed';
      spacer.style.outline = '0';
      spacer.style.margin = '0';
      spacer.style.padding = '0';
      spacer.style.border = '0';
      spacer.style.left = '0';
      spacer.style.whiteSpace = 'pre';
      spacer.style.fontSize = parent.style.fontSize;
      spacer.style.fontFamily = parent.style.fontFamily;
      spacer.style.fontWeight = 'normal';
      document.body.appendChild(spacer);
    }
    spacer.innerHTML = String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return spacer.getBoundingClientRect().right;
  };

}).call(this);
(function() {
  var cycleWithin;

  this.SuggestiveTextField = (function() {
    function SuggestiveTextField(textInput, possibleSuggestions) {
      this.textInput = textInput;
      this.possibleSuggestions = possibleSuggestions;
      this.initState();
      this.initElements();
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
      this.offeredSuggestions = [];
      return this.selectedSuggestionIndex = 0;
    };

    SuggestiveTextField.prototype.initState = function() {
      this.selectedSuggestionIndex = 0;
      return this.offeredSuggestions = [];
    };

    SuggestiveTextField.prototype.matchingSuggestions = function(token) {
      if (token.length < 1) {
        return [];
      }
      return this.possibleSuggestions.filter(function(suggestion) {
        return suggestion.startsWith(token);
      });
    };

    SuggestiveTextField.prototype.selectedSuggestion = function() {
      return this.offeredSuggestions[this.selectedSuggestionIndex];
    };

    SuggestiveTextField.prototype.initElements = function() {
      var container, outerContainer;
      this.suggestionsBox = document.createElement('div');
      this.suggestionsBox.style.position = 'absolute';
      this.suggestionsBox.style.fontFamily = this.textInput.style.fontFamily;
      this.suggestionsBox.style.fontSize = this.textInput.style.fontSize;
      debugger;
      outerContainer = this.textInput.parentNode;
      container = document.createElement('div');
      container.style.position = 'relative';
      container.appendChild(this.textInput);
      container.appendChild(this.suggestionsBox);
      return outerContainer.appendChild(container);
    };

    SuggestiveTextField.prototype.outmostToken = function() {
      return this.textInput.value.split(', ').pop();
    };

    SuggestiveTextField.prototype.tokensWithoutOutmost = function() {
      return this.textInput.value.split(', ').slice(0, -1);
    };

    SuggestiveTextField.prototype.replaceOutmostTokenWith = function(text) {
      var tokens;
      tokens = this.tokensWithoutOutmost();
      tokens.push(text);
      return this.textInput.value = tokens.join(', ');
    };

    SuggestiveTextField.prototype.renderSuggestionsBox = function() {
      var i, len, ref, suggestion, suggestionDiv;
      if (this.offeredSuggestions.length > 0) {
        this.suggestionsBox.innerHTML = '';
        ref = this.offeredSuggestions;
        for (i = 0, len = ref.length; i < len; i++) {
          suggestion = ref[i];
          suggestionDiv = document.createElement('div');
          suggestionDiv.innerHTML = suggestion;
          suggestionDiv.style.padding = '2px 5px';
          if (suggestion === this.selectedSuggestion()) {
            suggestionDiv.style['background-color'] = '#FFB7B2';
          }
          this.suggestionsBox.appendChild(suggestionDiv);
        }
        this.suggestionsBox.style.left = widthOfText(this.tokensWithoutOutmost().join(', '), {
          style: this.textInput
        });
        return this.suggestionsBox.style.visibility = 'visible';
      } else {
        return this.suggestionsBox.style.visibility = 'hidden';
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
