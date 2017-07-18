/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Todo.Application',

    name: 'Todo',

    requires: [
        // This will automatically load all classes in the Todo namespace
        // so that application classes do not need to require each other.
        'Todo.*'
    ],

    // The name of the initial view to create.
    mainView: 'Todo.view.main.Main'
});
