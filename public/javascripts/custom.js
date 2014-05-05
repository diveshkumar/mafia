/**
 * New node file
 */

var storage = window['localStorage'];

$('.btnplay').on('click', function(){
	if (storage.getItem('user') !== null) {
		window.location ='/groups';
	}
	else {
		window.location ='/user/register';
	}
	
});