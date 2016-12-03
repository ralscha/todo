Ext.define('Todo.view.todo.Controller', {
	extend: 'Ext.app.ViewController',

	init: function() {
		this.getStore('tags').load();
	},
	
	
	tagsRenderer: function(value) {
		if (Ext.isArray(value)) {
			var result = '';
			var ix;
			for (ix = 0; ix < value.length; ix++) {
				result += "<span class=\"label label-info\">";
				result += value[ix];
				result += "</span>";
			}
			return result;
		}
		return value;
	},
	
	onItemclick: function(grid, record) {
		var form = this.lookup('todoForm').getForm();
		form.reset();
		form.loadRecord(record);
		form.isValid();
		this.getViewModel().set('showEdit', true);
	},

	onNewClick: function() {
		var newTodo = new Todo.model.Todo();
		this.getViewModel().set('selectedTodo', null);		
		this.onItemclick(null, newTodo);
	},

	onDeleteClick: function() {
		var todo = this.getViewModel().get('selectedTodo');
		var me = this;
		Ext.Msg.confirm('Attention', 'Do you really want to delete: ' + todo.get('title'), function(choice) {
			if (choice === 'yes') {
				todo.erase({
		            success: function(record, operation) {
						me.getStore('tags').load();
						var form = me.lookup('todoForm').getForm();
						form.reset();
						me.getViewModel().set('showEdit', false);
						me.getViewModel().set('selectedTodo', null);
		            }
		        });
			}
		}, this);
	},

	onSearchChange: function(m) {
		this.getViewModel().set('searchButtonText', 'Search ' + m.text);
		this.lookup('searchButton').filterField = m.filterField;
	},

	onSearchClick: function() {
		this.getViewModel().set('selectedTodo', null);
		var store = this.getStore('todos');
		var value = this.lookup('filterTf').getValue();
		var filterType = this.lookup('searchButton').filterField;

		if (value) {
			if (filterType === 'title') {
				store.clearFilter();
				store.filter('title', value);
			}
			else if (filterType === 'description') {
				store.clearFilter();
				store.filter('description', value);
			}
			else if (filterType === 'tags') {
				store.clearFilter();
				store.filterBy(function(r) {
					var tags = r.get('tags');
					if (tags) {
						return tags.indexOf(value) !== -1;
					}
					return false;
				});
			}			
		}
		else {
			store.clearFilter();
		}
	},

	onSaveClick: function() {
		var form = this.lookup('todoForm').getForm();
		if (form.isValid()) {
			this.getView().mask('Saving...');

			form.updateRecord();
			var record = form.getRecord()
			var isPhantom = record.phantom;

			record.save({
				scope: this,
				success: function(record, operation) {
					if (isPhantom) {
						var store = this.getStore('todos');
						store.add(record);
					}
					this.getStore('tags').load();
				},
				failure: function(record, operation) {
					var validations = operation.getResponse().result.validations;
					this.markInvalidFields(form, validations);
				},
				callback: function(record, operation, success) {
					this.getView().unmask();
				}
			});
		}
	},

	markInvalidFields: function(form, validations) {
		validations.forEach(function(validation) {
			var field = form.findField(validation.field);
			if (field) {
				field.markInvalid(validation.messages);
			}
		});
	},

	onCancelClick: function() {
		var todo = this.getViewModel().get('selectedTodo');
		todo.cancelEdit();
		this.getViewModel().set('selectedTodo', null);
	}

});
