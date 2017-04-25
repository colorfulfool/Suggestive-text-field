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