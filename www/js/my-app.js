// Export selectors engine
var $$ = Dom7;

// Initialize your app
var myApp = new Framework7(
	{
	material: true,
	materialPageLoadDelay: 2,
	animatePages: false
});

// Export selectors engine
var $$ = Dom7;

var mainView = myApp.addView('.view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});