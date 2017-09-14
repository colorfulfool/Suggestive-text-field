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
  this.setStyle = function(element, properties) {
    return Object.assign(element.style, properties);
  };

  this.createElement = function(html, style) {
    var div, generated;
    div = document.createElement('div');
    div.innerHTML = html;
    generated = div.firstChild;
    if (style != null) {
      setStyle(generated, style);
    }
    return generated;
  };

}).call(this);
(function() {
  this.SuggestionsBox = (function() {
    function SuggestionsBox(options) {
      this.container = createElement("<div></div>", {
        position: 'absolute',
        zIndex: 9,
        fontFamily: options.styleFrom.style.fontFamily,
        fontSize: options.styleFrom.style.fontSize,
        border: '1px solid #FFB7B2',
        backgroundColor: 'white'
      });
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

    SuggestionsBox.prototype.renderSuggestion = function(suggestion) {
      var suggestionDiv;
      suggestionDiv = createElement("<div class='suggestion'>" + (this.suggestionText(suggestion)) + "</div>", {
        padding: '2px 5px',
        cursor: 'pointer'
      });
      if (suggestion === this.context.selectedSuggestion()) {
        setStyle(suggestionDiv, {
          backgroundColor: '#FFB7B2'
        });
      }
      this.suggestionEventHandlers(suggestionDiv);
      return suggestionDiv;
    };

    SuggestionsBox.prototype.suggestionText = function(suggestion) {
      if (suggestion instanceof Object) {
        return suggestion.text;
      } else {
        return suggestion;
      }
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
      return suggestionDiv.addEventListener('mousedown', (function(_this) {
        return function() {
          _this.context.onConfirm();
          return _this.context.renderSuggestionsBox();
        };
      })(this));
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
  var shiftWithinLimits, waitOn;

  this.SuggestiveTextField = (function() {
    function SuggestiveTextField(textInput, possibleSuggestions, options1) {
      this.textInput = textInput;
      this.possibleSuggestions = possibleSuggestions;
      this.options = options1 != null ? options1 : {};
      this.defaultOptions({
        tokenSeparator: ', '
      });
      this.initInternalState();
      this.initElements();
      this.initEventHandlers();
      this.renderSuggestionsBox();
    }

    SuggestiveTextField.prototype.defaultOptions = function(defaultOptions) {
      return this.options = Object.assign(defaultOptions, this.options);
    };

    SuggestiveTextField.prototype.onType = function() {
      return waitOn(this.matchingSuggestions(this.outmostToken())).then((function(_this) {
        return function(matchingSuggestions) {
          _this.offeredSuggestions = matchingSuggestions;
          return _this.renderSuggestionsBox();
        };
      })(this));
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
      var base;
      this.replaceOutmostTokenWith(this.selectedSuggestion());
      this.offeredSuggestions = [];
      this.selectedSuggestionIndex = 0;
      return typeof (base = this.options).onConfirmHook === "function" ? base.onConfirmHook(this.selectedSuggestion()) : void 0;
    };

    SuggestiveTextField.prototype.initInternalState = function() {
      this.offeredSuggestions = [];
      return this.selectedSuggestionIndex = 0;
    };

    SuggestiveTextField.prototype.matchingSuggestions = function(token) {
      if (token.length < 1) {
        return [];
      }
      return (this.options.suggestionsForToken || this.suggestionsForToken).call(this, token);
    };

    SuggestiveTextField.prototype.suggestionsForToken = function(token) {
      return this.possibleSuggestions.filter(function(suggestion) {
        return suggestion.startsWith(token);
      });
    };

    SuggestiveTextField.prototype.selectedSuggestion = function() {
      return this.offeredSuggestions[this.selectedSuggestionIndex];
    };

    SuggestiveTextField.prototype.initElements = function() {
      var container;
      container = createElement("<div class='suggestive-container'></div>", {
        position: 'relative'
      });
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
      if (this.options.tokenSeparator) {
        return this.textInput.value.split(this.options.tokenSeparator).pop();
      } else {
        return this.textInput.value;
      }
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
      this.textInput.addEventListener('input', (function(_this) {
        return function() {
          return _this.onType();
        };
      })(this));
      return this.textInput.addEventListener('keydown', (function(_this) {
        return function(event) {
          var passThrough;
          if (event.which === 13 || event.which === 9 || event.which === 39) {
            _this.onConfirm();
          } else if (event.which === 38) {
            _this.onArrow(-1);
          } else if (event.which === 40) {
            _this.onArrow(1);
          } else {
            passThrough = true;
          }
          if (!passThrough) {
            _this.renderSuggestionsBox();
            event.preventDefault();
            return event.stopPropagation();
          }
        };
      })(this));
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

  waitOn = function(value) {
    var promise;
    return promise = value instanceof Promise ? value : Promise.resolve(value);
  };

}).call(this);
