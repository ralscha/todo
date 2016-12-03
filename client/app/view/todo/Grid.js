Ext.define('Todo.view.todo.Grid', {
	extend: 'Ext.grid.Panel',

	autoLoad: true,

	bind: {
		store: '{todos}',
		selection: '{selectedTodo}'
	},

	listeners: {
		itemclick: 'onItemclick'
	},

	columns: [ {
		text: 'Title',
		dataIndex: 'title',
		flex: 1
	}, {
		xtype: 'datecolumn',
		format: 'Y-m-d',
		text: 'Due',
		dataIndex: 'due',
		flex: 1
	}, {
		text: 'Tags',
		dataIndex: 'tags',
		flex: 1,
		renderer: 'tagsRenderer'
	} ],

	dockedItems: [ {
		xtype: 'toolbar',
		dock: 'top',
		items: [ {
			text: 'New',
			iconCls: 'x-fa fa-plus',
			handler: 'onNewClick'
		}, {
			text: 'Delete',
			iconCls: 'x-fa fa-trash',
			handler: 'onDeleteClick',
			bind: {
				disabled: '{!selectedTodo}'
			}
		}, {
			emptyText: 'Filter',
			xtype: 'textfield',
			width: 250,
			reference: 'filterTf',
			listeners: {
                change: {
                    fn: 'onSearchClick',
                    buffer: 300
                }
            },
			plugins: [ {
				ptype: 'clearable'
			} ]			
		}, {
			xtype: 'splitbutton',
			bind: {
				text: '{searchButtonText}'
			},
			iconCls: 'x-fa fa-search',
			handler: 'onSearchClick',
			reference: 'searchButton',
			filterField: 'title',
			menu: new Ext.menu.Menu({
				items: [ {
					text: 'Title',
					handler: 'onSearchChange',
					filterField: 'title'
				}, {
					text: 'Description',
					handler: 'onSearchChange',
					filterField: 'description'
				}, {
					text: 'Tags',
					handler: 'onSearchChange',
					filterField: 'tags'
				} ]
			})
		} ]

	} ]

});