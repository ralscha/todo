Ext.define('Todo.view.changes.Controller', {
	extend: 'Ext.app.ViewController',

	init: function() {
		var me = this;
		me.onHistoryChangeCallback = me.onHistoryChange.bind(me);

		Todo.EventBus.start(function() {
			Todo.EventBus.subscribe("historychange", me.onHistoryChangeCallback);
		});
	},

	destroy: function() {
		Todo.EventBus.unsubscribe("historychange", this.onHistoryChangeCallback);
		Todo.EventBus.stop();
	},

	onHistoryChange: function() {
		this.getStore('changes').reload();
	}

});