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

	routeToTodo() {
		this.switchTab(0);
	},

	routeToChanges() {
		this.switchTab(1);
	},

	switchTab(no) {
		this.getView().suspendEvents(false);
		this.getView().setActiveTab(no);
		this.getView().resumeEvents(false);
	},

	onBeforeTabChange(tabPanel, newCard) {
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
