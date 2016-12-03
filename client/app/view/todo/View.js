Ext.define('Todo.view.todo.View', {
	extend: 'Ext.panel.Panel',

	controller: {
		xclass: 'Todo.view.todo.Controller'
	},

	viewModel: {
		xclass: 'Todo.view.todo.ViewModel'
	},

	title: 'Todo',
	layout: 'hbox',

	items: [ {
		xclass: 'Todo.view.todo.Grid',
		flex: 2,
		height: '100%',
		padding: 20
	}, {
		xclass: 'Todo.view.todo.Form',
		flex: 1,
		height: '100%',
		padding: 20
	} ]
});