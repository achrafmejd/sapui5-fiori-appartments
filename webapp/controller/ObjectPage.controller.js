sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("appartments.controller.ObjectPage", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("appartmentsDetails").attachPatternMatched(this._onItemMatched, this);
        },
        _onItemMatched: function (oEvent) {
            var that = this
            var sItemId = oEvent.getParameter("arguments").id;
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
        },
        onDelete: function(oEvent){
            // Delete Item from tables
            var oObjectHeader = this.byId("_IDGenObjectHeader1");
            const oModel = this.getOwnerComponent().getModel();
            var oObject = oObjectHeader.getBindingContext().getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            // oRouter.navTo("RouteView1");

            sap.m.MessageBox.show(
                "Are you sure you want to delete this item?",
                {
                  icon: sap.m.MessageBox.Icon.WARNING,
                  title: "Delete",
                  actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                  onClose: function(oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                      // Delete item logic here
                      //   that.deleteItem();
                      console.log(oObject);
                      oModel.remove(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`,{
                        success: function(){
                            oRouter.navTo("RouteView1");
                        }
                      })
                    }
                  }
                })            
        },
        _deleteItem: function(){
            var oObjectHeader = this.byId("_IDGenObjectHeader1");
            var oObject = oObjectHeader.getBindingContext().getObject();

            oModel.dele
        }
        
    });
});