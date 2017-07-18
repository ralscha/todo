Ext.define('Todo.Application', {
	extend: 'Ext.app.Application',
	requires: [ 'Ext.direct.*', 'Ext.plugin.Viewport' ],
	name: 'Todo',

	stores: [],
	defaultToken: 'todo',
	
    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

	launch: function() {
		REMOTING_API.url = serverUrl + REMOTING_API.url;
		REMOTING_API.maxRetries = 0;

		Ext.direct.Manager.addProvider(REMOTING_API);

		this.callParent(arguments);
	},

	onAppUpdate: function() {
		window.location.reload();
	}
});
