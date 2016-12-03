Ext.define('Todo.view.todo.ViewModel', {
	extend: 'Ext.app.ViewModel',

	data: {
		selectedTodo: null,
		searchButtonText: 'Search Title',
		showEdit: false
	},

	stores: {
		todos: {
			model: 'Todo.model.Todo',
			autoLoad: false,
			remoteSort: false,
			remoteFilter: false,
			pageSize: 0,
			sorters: [ {
				property: 'due',
				direction: 'ASC'
			} ]
		},
		tags: {
			fields: [ {
				name: 'tag',
				mapping: 0
			} ],
			xclass: 'Ext.data.ArrayStore',
			autoLoad: false,
			remoteSort: false,
			remoteFilter: false,
			pageSize: 0,
			sorters: [ {
				property: 'tag',
				direction: 'ASC'
			} ],
			proxy: {
				type: 'direct',
				directFn: 'todoService.readTags'
			}
		}
	}

});
