// triggerEvent({ type: 'click', node: Element })
// triggerEvent({ type: 'keyup', keyCode: '13', node: Element })
export default ({ type = 'click', keyCode }, node = document.body) => {
	const eventType = /^(mouse|dblclick|contextmenu)/.test(type)
		? 'MouseEvents'
		: /^key/.test(type)
			? 'KeyboardEvent'
			: 'Event';

	const event = document.createEvent(eventType);
	event.initEvent(type, true, true);
	keyCode && (event.keyCode = keyCode);
	node.dispatchEvent(event);
}