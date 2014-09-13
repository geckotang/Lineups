## Requirements

- jQuery.js
- Underscore.js

## Usage

```javascript
$(function(){
  var lineups = new Lineups([
    '.js-lineup1',
    '.js-lineup2',
  ],{
    resize: true
  });
  $('.mod-wrapper').imagesLoaded( function() {
    lineups.refreshAll();
  });
});
```

## License

MIT

User at your own risk.
