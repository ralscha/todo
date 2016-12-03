Ext.define('Todo.view.changes.ViewModel', {
	extend: 'Ext.app.ViewModel',

	stores: {
		changes: {
			autoLoad: false,
			pageSize: 0,
			proxy: {
				type: 'direct',
				directFn: 'changesService.getTodoChanges'
			}
		}
	}

});
