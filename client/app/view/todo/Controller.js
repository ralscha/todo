Ext.define('Todo.view.todo.Controller', {
	extend: 'Ext.app.ViewController',

	init() {
		this.getStore('tags').load();
	},
	
	
	tagsRenderer(value) {
		if (Ext.isArray(value)) {
			let result = '';

			for (let ix = 0; ix < value.length; ix++) {
				result += "<span class=\"label label-info\">";
				result += value[ix];
				result += "</span>";
			}
			return result;
		}
		return value;
	},
	
	onItemclick(grid, record) {
		const form = this.lookup('todoForm').getForm();
		form.reset();
		form.loadRecord(record);
		form.isValid();
		this.getViewModel().set('showEdit', true);
	},

	onNewClick() {
		const newTodo = new Todo.model.Todo();
		this.getViewModel().set('selectedTodo', null);		
		this.onItemclick(null, newTodo);
	},

	onDeleteClick() {
		const todo = this.getViewModel().get('selectedTodo');
		const me = this;
		Ext.Msg.confirm('Attention', 'Do you really want to delete: ' + todo.get('title'), function(choice) {
			if (choice === 'yes') {
				todo.erase({
		            success(record, operation) {
						me.getStore('tags').load();
						const form = me.lookup('todoForm').getForm();
						form.reset();
						me.getViewModel().set('showEdit', false);
						me.getViewModel().set('selectedTodo', null);
		            }
		        });
			}
		}, this);
	},

	onSearchChange(m) {
		this.getViewModel().set('searchButtonText', 'Search ' + m.text);
		this.lookup('searchButton').filterField = m.filterField;
	},

	onSearchClick() {
		this.getViewModel().set('selectedTodo', null);
		const store = this.getStore('todos');
		const value = this.lookup('filterTf').getValue();
		const filterType = this.lookup('searchButton').filterField;

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
					const tags = r.get('tags');
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

	onSaveClick() {
		const form = this.lookup('todoForm').getForm();
		if (form.isValid()) {
			this.getView().mask('Saving...');

			form.updateRecord();
			const record = form.getRecord()
			const isPhantom = record.phantom;

			record.save({
				scope: this,
				success(record, operation) {
					if (isPhantom) {
						const store = this.getStore('todos');
						store.add(record);
					}
					this.getStore('tags').load();
				},
				failure(record, operation) {
					const validations = operation.getResponse().result.validations;
					this.markInvalidFields(form, validations);
				},
				callback(record, operation, success) {
					this.getView().unmask();
				}
			});
		}
	},

	markInvalidFields(form, validations) {
		validations.forEach(function(validation) {
			const field = form.findField(validation.field);
			if (field) {
				field.markInvalid(validation.messages);
			}
		});
	},

	onCancelClick() {
		const form = this.lookup('todoForm').getForm();
		form.reset();
		this.getViewModel().set('showEdit', false);
		this.getViewModel().set('selectedTodo', null);
	}

});
