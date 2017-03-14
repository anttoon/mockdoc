# MockDoc - Mock document for tests

## Usage

```javascript
And('DOM is loaded', () => {
  global.document = new Mockdock();
  require('app.js');
});
```

```javascript
let testValue;

When('DOM is loaded', () => {
  global.document = new Mockdock();
  global.document.body = new Mockdock();
  global.document.body.on('setAttribute', (value) => {
    testValue = value;
  });
});

Then('app is started', () => {
  require('app.js');
  testValue.should.equal('some-attribute');
})
```

## Events

`global.document.on('setAttribute', (value) => {}));`

`global.document.on('removeAttribute', (value) => {}));`

`global.document.on('DOMContentLoaded', () => {});`

`global.document.on('appendChild', (element) => {}));`

`global.document.domContentLoaded()`

`global.document.triggerEventListener(type)`

## Supported node functions

`addEventListener(type, fn)`

`createElement(type)`

`getElementsByTagName(tag)`

`removeAttribute(attrName)`

`setAttribute(cmd, value)`

`hasAttribute(attrName)`

`getElementById(id)`

`querySelector(selectors)`

`querySelectorAll()`

`getAttribute(name)`

`appendChild(element)`
