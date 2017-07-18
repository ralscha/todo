Ext.define('Todo.view.main.Main', {
	extend: 'Ext.tab.Panel',

	controller: {
		xclass: 'Todo.view.main.MainController'
	},
	viewModel: {
		xclass: 'Todo.view.main.MainModel'
	},

	listeners: {
		beforetabchange: 'onBeforeTabChange'
	},

	items: [ {
		xclass: 'Todo.view.todo.View'
	}, {
		xclass: 'Todo.view.changes.View'
	} ]
});
