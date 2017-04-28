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
(function(document, EventTarget) {
  var elementProto = window.Element.prototype,
      matchesFn = elementProto.matches;

  /* Check various vendor-prefixed versions of Element.matches */
  if(!matchesFn) {
    ['webkit', 'ms', 'moz'].some(function(prefix) {
      var prefixedFn = prefix + 'MatchesSelector';
      if(elementProto.hasOwnProperty(prefixedFn)) {
        matchesFn = elementProto[prefixedFn];
        return true;
      }
    });
  }

  /* Traverse DOM from event target up to parent, searching for selector */
  function passedThrough(event, selector, stopAt) {
    var currentNode = event.target;

    while(true) {
      if(matchesFn.call(currentNode, selector)) {
        return currentNode;
      }
      else if(currentNode != stopAt && currentNode != document.body) {
        currentNode = currentNode.parentNode;
      }
      else {
        return false;
      }
    }
  }

  /* Extend the EventTarget prototype to add a delegateEventListener() event */
  EventTarget.prototype.delegateEventListener = function(eName, toFind, fn) {
    this.addEventListener(eName, function(event) {
      var found = passedThrough(event, toFind, event.currentTarget);

      if(found) {
        // Execute the callback with the context set to the found element
        // jQuery goes way further, it even has it's own event object
        fn.call(found, event);
      }
    });
  };

}(window.document, window.EventTarget || window.Element));
(function() {
  this.SuggestionsBox = (function() {
    function SuggestionsBox(options) {
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.fontFamily = options.styleFrom.style.fontFamily;
      this.container.style.fontSize = options.styleFrom.style.fontSize;
      this.container.style.border = '1px solid #FFB7B2';
    }

    SuggestionsBox.prototype.renderFor = function(context) {
      var i, len, ref, suggestion;
      this.context = context;
      if (this.context.offeredSuggestions.length > 0) {
        this.container.innerHTML = '';
        ref = this.context.offeredSuggestions;
        for (i = 0, len = ref.length; i < len; i++) {
          suggestion = ref[i];
          this.container.appendChild(this.renderSuggestion(suggestion));
        }
        this.container.style.left = widthOfText(this.context.tokensWithoutOutmost().join(', '), {
          style: this.container
        });
        return this.container.style.visibility = 'visible';
      } else {
        return this.container.style.visibility = 'hidden';
      }
    };

    SuggestionsBox.prototype.renderSuggestion = function(text) {
      var suggestionDiv;
      suggestionDiv = document.createElement('div');
      suggestionDiv.className = 'suggestion';
      suggestionDiv.innerHTML = text;
      suggestionDiv.style.padding = '2px 5px';
      if (text === this.context.selectedSuggestion()) {
        suggestionDiv.style.backgroundColor = '#FFB7B2';
      }
      return suggestionDiv;
    };

    return SuggestionsBox;

  })();

}).call(this);
(function() {
  var cycleWithin;

  this.SuggestiveTextField = (function() {
    function SuggestiveTextField(textInput, possibleSuggestions) {
      this.textInput = textInput;
      this.possibleSuggestions = possibleSuggestions;
      this.initInternalState();
      this.initElements();
      this.initEventHandlers();
      this.renderSuggestionsBox();
    }

    SuggestiveTextField.prototype.onType = function() {
      return this.offeredSuggestions = this.matchingSuggestions(this.outmostToken());
    };

    SuggestiveTextField.prototype.onArrow = function(shift) {
      return this.selectedSuggestionIndex = cycleWithin(this.selectedSuggestionIndex, shift, {
        limits: [0, this.offeredSuggestions.length - 1]
      });
    };

    SuggestiveTextField.prototype.onConfirm = function() {
      this.replaceOutmostTokenWith(this.selectedSuggestion());
      this.offeredSuggestions = [];
      return this.selectedSuggestionIndex = 0;
    };

    SuggestiveTextField.prototype.initInternalState = function() {
      this.offeredSuggestions = [];
      return this.selectedSuggestionIndex = 0;
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

    SuggestiveTextField.prototype.selectSuggestionByText = function(text) {
      return this.selectedSuggestionIndex = this.possibleSuggestions.indexOf(text);
    };

    SuggestiveTextField.prototype.initElements = function() {
      var container, outerContainer;
      outerContainer = this.textInput.parentNode;
      container = document.createElement('div');
      container.style.position = 'relative';
      this.textInput.autocomplete = 'off';
      this.suggestionsBox = new SuggestionsBox({
        styleFrom: this.textInput
      });
      container.appendChild(this.textInput);
      container.appendChild(this.suggestionsBox.container);
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
      return this.suggestionsBox.renderFor(this);
    };

    SuggestiveTextField.prototype.initEventHandlers = function() {
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

  cycleWithin = function(initialValue, shift, options) {
    var attemptedValue, max, min, ref;
    ref = options.limits, min = ref[0], max = ref[1];
    attemptedValue = initialValue + shift;
    if (attemptedValue > max) {
      return min;
    } else if (attemptedValue < min) {
      return max;
    } else {
      return attemptedValue;
    }
  };

}).call(this);
