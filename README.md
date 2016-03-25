ScrollAssist
===================
A jQuery plugin to assist with scrolling from element to element. Use case; when you want the page adjust down or up to specific elements once the user scrolling completes.


Tested with:

- jQuery 1.9 and greater


Use:

```javascript
jQuery( document ).ready(function($) {
   
   	$(".elements").ScrollAssist({
   		percentage: 0.10
   	,	timeout: 	100
   	,	transition: 500
   	});

});
```