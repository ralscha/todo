var REMOTING_API = {
  "url" : "router",
  "type" : "remoting",
  "actions" : {
    "changesService" : [ {
      "name" : "getTodoChanges",
      "len" : 1
    } ],
    "eventBusController" : [ {
      "name" : "logClientCrash",
      "len" : 2
    }, {
      "name" : "subscribe",
      "len" : 2
    }, {
      "name" : "unregisterClient",
      "len" : 1
    }, {
      "name" : "unsubscribe",
      "len" : 2
    } ],
    "todoService" : [ {
      "name" : "destroy",
      "len" : 1
    }, {
      "name" : "read",
      "len" : 1
    }, {
      "name" : "readTags",
      "len" : 1
    }, {
      "name" : "update",
      "len" : 1
    } ]
  }
};