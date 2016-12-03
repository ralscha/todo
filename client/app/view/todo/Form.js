Ext.define('Todo.view.todo.Form', {
	extend: 'Ext.form.Panel',

	defaultFocus: 'textfield[name=title]',
	reference: 'todoForm',
	defaults: {
		labelAlign: 'top',
		anchor: '100%',
		readonly: true
	},

	scrollable: true,
	bind: {
		disabled: '{!showEdit}'
	},

	items: [ {
		xtype: 'displayfield',
		fieldLabel: 'ID',
		name: 'id'
	}, {
		xtype: 'textfield',
		fieldLabel: 'Title',
		name: 'title',
		allowBlank: false
	}, {
		xtype: 'datefield',
		fieldLabel: 'Due',
		name: 'due',
		format: 'Y-m-d',
		minValue: new Date(),
		validator: function(value) {
			if (Ext.isEmpty(value)) {
				return true;
			}
			var inputDate = Ext.Date.parse(value, 'Y-m-d');
			var now = new Date();
			if (inputDate < now) {
				return 'Must be in the future';
			}

			return true;
		}
	}, {
		xtype: 'tagfield',
		fieldLabel: 'Tags',
		bind: {
			store: '{tags}'
		},
		name: 'tags',
		displayField: 'tag',
		valueField: 'tag',
		queryMode: 'local',
		forceSelection: false,
		filterPickList: true,
		createNewOnEnter: true,
		createNewOnBlur: true
	}, {
		xtype: 'textareafield',
		fieldLabel: 'Description',
		name: 'description',
		height: 160
	} ],

	dockedItems: [ {
		xtype: 'toolbar',
		dock: 'bottom',
		items: [ {
			text: 'Save',
			iconCls: 'x-fa fa-floppy-o',
			handler: 'onSaveClick',
			formBind: true
		}, {
			text: 'Cancel',
			iconCls: 'x-fa fa-ban',
			handler: 'onCancelClick'
		} ]
	} ]

});