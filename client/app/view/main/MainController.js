Ext.define('Todo.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	routes: {
		'todo': {
			action: 'routeToTodo'
		},

		'changes': {
			action: 'routeToChanges'
		}
	},

	routeToTodo: function() {
		this.switchTab(0);
	},

	routeToChanges: function() {
		this.switchTab(1);
	},

	switchTab: function(no) {
		this.getView().suspendEvents(false);
		this.getView().setActiveTab(no);
		this.getView().resumeEvents(false);
	},

	onBeforeTabChange: function(tabPanel, newCard) {
		if (newCard.xclass === 'Todo.view.changes.View') {
			this.redirectTo('changes');
			document.title = 'Changes';
		}
		else if (newCard.xclass === 'Todo.view.todo.View') {
			this.redirectTo('todo');
			document.title = 'Todo';
		}
		return false;
	}

});
