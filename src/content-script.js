
// add empty data link
let link = document.createElement('a');
link.style.display = 'none';
link.setAttribute('target', '_blank');
document.body.append(link);

function simulateClick(elem) {
	const evt = new MouseEvent('click', {
		bubbles: false,
		cancelable: false,
		view: window
	});
	elem.dispatchEvent(evt);
}

// register message listener 
browser.runtime.onMessage.addListener( (message) => {
	if(message.url) {
		link.setAttribute('href',message.url);
		simulateClick(link);
	}
});
