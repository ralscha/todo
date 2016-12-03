Ext.define("Todo.model.Todo",
{
  extend : "Ext.data.Model",
  requires : [ "Ext.data.identifier.Uuid", "Ext.data.proxy.Direct", "Ext.data.validator.Presence" ],
  identifier : "uuid",
  fields : [ {
    name : "id",
    type : "string"
  }, {
    name : "due",
    type : "date",
    dateFormat : "U"
  }, {
    name : "title",
    type : "string",
    validators : [ {
      type : "presence"
    } ]
  }, "tags", {
    name : "description",
    type : "string",
    allowNull : true
  } ],
  proxy : {
    type : "direct",
    api : {
      read : "todoService.read",
      create : "todoService.update",
      update : "todoService.update",
      destroy : "todoService.destroy"
    },
    reader : {
      rootProperty : "records"
    },
    writer : {
      writeAllFields : true
    }
  }
});