Ext.define('Todo.Application', {
	extend: 'Ext.app.Application',
	requires: [ 'Ext.plugin.Viewport', 'Todo.*', 'Ext.direct.*', 'Ext.window.Toast', 'Ext.form.action.DirectSubmit',
			'Ext.form.action.DirectLoad', 'Ext.container.Container' ],
	name: 'Todo',

	stores: [],
	defaultToken: 'todo',
	
	launch: function() {
		// <debug>
		Ext.Ajax.on('beforerequest', function(conn, options, eOpts) {
			options.withCredentials = true;
		}, this);
		// </debug>

		REMOTING_API.url = serverUrl + REMOTING_API.url;
		REMOTING_API.maxRetries = 0;

		Ext.direct.Manager.addProvider(REMOTING_API);

		this.callParent(arguments);
	},

	onAppUpdate: function() {
		window.location.reload();
	}
});
