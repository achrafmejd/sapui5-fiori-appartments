sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("appartments.controller.ObjectPage", {

        onInit: function () {
            // set explored app's demo model on this sample
            // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
            // this.getView().setModel(oModel);
            // this.byId("idPage").bindElement("/ProductCollection/0");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("appartmentsDetails").attachPatternMatched(this._onItemMatched, this);
        },
        _onItemMatched: function (oEvent) {
            var that = this
            var sItemId = oEvent.getParameter("arguments").id;
            console.log(sItemId);
            // var oModel = this.getView().getModel("myModel");
            // var oItem = oModel.getProperty("/items/" + sItemId);

            // // Set the item data on the view
            // this.getView().bindElement({
            //     path: "/items/" + sItemId,
            //     model: "myModel"
            // });
            const oModel = this.getOwnerComponent().getModel();
            oModel.read(`/APPARTMENTSHeadersSet('${sItemId}')`, {
                success: function (oData) {
                    console.log(oData);
                    const jModel = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(jModel);
                    that.getView().bindElement({
                        path: "/"
                      });
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
        },
        formatPrice: function(price, currency) {
            if (typeof price === "string") {
                price = parseInt(price, 10);
            }
            return new sap.ui.model.type.Currency().formatValue([price, currency], "string");
        }
        
    });
});