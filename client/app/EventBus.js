Ext.define("Todo.EventBus", {
	requires: [ 'Ext.data.identifier.Uuid' ],
	singleton: true,

	constructor: function() {
		this.id = Ext.data.identifier.Uuid.create().generate();
	},

	start: function(callback) {
		this.eventSource = new EventSource(serverUrl + 'eventbus/' + this.id);
		if (callback) {
			this.eventSource.addEventListener('open', callback);
		}
		this.eventSource.addEventListener('error', this.onError, false);

	},

	stop: function(callback) {
		eventBusController.unregisterClient(this.id, callback);
		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
		}
	},

	onError: function(event) {
		eventBusController.logClientCrash(event.type, event.detail);
	},

	subscribe: function(eventName, listener) {
		eventBusController.subscribe(this.id, eventName);
		this.eventSource.addEventListener(eventName, listener, false);
	},

	unsubscribe: function(eventName, listener) {
		eventBusController.unsubscribe(this.id, eventName);
		this.eventSource.removeEventListener(eventName, listener, false);
	}
});