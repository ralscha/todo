Ext.define('Todo.view.changes.Controller', {
	extend: 'Ext.app.ViewController',

	init() {
		const me = this;
		me.onHistoryChangeCallback = me.onHistoryChange.bind(me);

		Todo.EventBus.start(function() {
			Todo.EventBus.subscribe("historychange", me.onHistoryChangeCallback);
		});
	},

	destroy() {
		Todo.EventBus.unsubscribe("historychange", this.onHistoryChangeCallback);
		Todo.EventBus.stop();
	},

	onHistoryChange() {
		this.getStore('changes').reload();
	}

});