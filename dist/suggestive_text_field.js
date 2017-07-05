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
      this.container.style.backgroundColor = 'white';
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
        this.container.style.left = this.context.suggestionBoxLeftMargin();
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
      suggestionDiv.style.cursor = 'pointer';
      if (text === this.context.selectedSuggestion()) {
        suggestionDiv.style.backgroundColor = '#FFB7B2';
      }
      this.suggestionEventHandlers(suggestionDiv);
      return suggestionDiv;
    };

    SuggestionsBox.prototype.suggestionEventHandlers = function(suggestionDiv) {
      var parentTextField;
      parentTextField = this.context;
      suggestionDiv.addEventListener('mouseenter', function() {
        parentTextField.onHover({
          suggestionText: this.textContent
        });
        return parentTextField.renderSuggestionsBox();
      });
      return suggestionDiv.addEventListener('mousedown', function() {
        parentTextField.onConfirm();
        return parentTextField.renderSuggestionsBox();
      });
    };

    return SuggestionsBox;

  })();

}).call(this);
(function() {
  this.wrapElement = function(wrapper, options) {
    var toWrap;
    toWrap = options['around'];
    wrapper = wrapper || document.createElement('div');
    if (toWrap.nextSibling) {
      toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
    } else {
      toWrap.parentNode.appendChild(wrapper);
    }
    return wrapper.appendChild(toWrap);
  };

}).call(this);
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
      spacer.style.padding = parent.style.padding;
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
  var shiftWithinLimits;

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
      return this.selectedSuggestionIndex = shiftWithinLimits(this.selectedSuggestionIndex, shift, {
        limits: [0, this.offeredSuggestions.length - 1]
      });
    };

    SuggestiveTextField.prototype.onHover = function(options) {
      if (options == null) {
        options = {};
      }
      return this.selectedSuggestionIndex = this.offeredSuggestions.indexOf(options.suggestionText);
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

    SuggestiveTextField.prototype.initElements = function() {
      var container;
      container = document.createElement('div');
      container.className = 'suggestive-container';
      container.style.position = 'relative';
      this.textInput.autocomplete = 'off';
      this.suggestionsBox = new SuggestionsBox({
        styleFrom: this.textInput
      });
      wrapElement(container, {
        around: this.textInput
      });
      return container.appendChild(this.suggestionsBox.container);
    };

    SuggestiveTextField.prototype.outmostToken = function() {
      return this.textInput.value.split(', ').pop();
    };

    SuggestiveTextField.prototype.valueWithoutOutmostToken = function() {
      return this.textInput.value.slice(0, -1 * this.outmostToken().length);
    };

    SuggestiveTextField.prototype.replaceOutmostTokenWith = function(text) {
      return this.textInput.value = this.valueWithoutOutmostToken() + text;
    };

    SuggestiveTextField.prototype.renderSuggestionsBox = function() {
      return this.suggestionsBox.renderFor(this);
    };

    SuggestiveTextField.prototype.suggestionBoxLeftMargin = function() {
      return widthOfText(this.valueWithoutOutmostToken(), {
        style: this.textInput
      });
    };

    SuggestiveTextField.prototype.initEventHandlers = function() {
      var self;
      self = this;
      this.textInput.addEventListener('input', function() {
        self.onType();
        return self.renderSuggestionsBox();
      });
      return this.textInput.addEventListener('keydown', function(event) {
        var passThrough;
        if (event.which === 13 || event.which === 9 || event.which === 39) {
          self.onConfirm();
        } else if (event.which === 38) {
          self.onArrow(-1);
        } else if (event.which === 40) {
          self.onArrow(1);
        } else {
          passThrough = true;
        }
        if (!passThrough) {
          self.renderSuggestionsBox();
          event.preventDefault();
          return event.stopPropagation();
        }
      });
    };

    return SuggestiveTextField;

  })();

  shiftWithinLimits = function(initialValue, shift, options) {
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
