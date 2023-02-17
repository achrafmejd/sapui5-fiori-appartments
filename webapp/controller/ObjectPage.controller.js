sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
"use strict";

return Controller.extend("appartments.controller.ObjectPage", {

    onInit : function () {
        // set explored app's demo model on this sample
        // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
        // this.getView().setModel(oModel);
        // this.byId("idPage").bindElement("/ProductCollection/0");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("appartmentsDetails").attachPatternMatched(this._onItemMatched, this);
    },
    _onItemMatched: function(oEvent) {
        var sItemId = oEvent.getParameter("arguments").id;
        console.log(sItemId);
        // var oModel = this.getView().getModel("myModel");
        // var oItem = oModel.getProperty("/items/" + sItemId);
        
        // // Set the item data on the view
        // this.getView().bindElement({
        //     path: "/items/" + sItemId,
        //     model: "myModel"
        // });
    }
});
});