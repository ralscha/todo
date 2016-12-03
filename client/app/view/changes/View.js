Ext.define('Todo.view.changes.View', {
	extend: 'Ext.grid.Panel',

	controller: {
		xclass: 'Todo.view.changes.Controller'
	},

	viewModel: {
		xclass: 'Todo.view.changes.ViewModel'
	},
		
	autoLoad: true,
	
	bind: {
		store: '{changes}'
	},

	title: 'Changes',

	columns: [ {
		text: 'Timestamp',
		dataIndex: 'timestamp',
		renderer: function(value) {
			return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
		},
		width: 160
	}, {
		text: 'Type',
		dataIndex: 'type',
		width: 80
	}, {
		text: 'Id',
		dataIndex: 'todoId',
		width: 280
	}, {
		text: 'Property Name',
		dataIndex: 'property',
		width: 140
	}, {
		text: 'Old',
		dataIndex: 'left',
		flex: 1
	}, {
		text: 'New',
		dataIndex: 'right',
		flex: 1
	} ]
});