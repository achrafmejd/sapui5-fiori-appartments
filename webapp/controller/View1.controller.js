sap.ui.define([
    "sap/ui/core/mvc/Controller"
    // "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        return Controller.extend("appartments.controller.View1", {
            onInit: function () {
                this.onReadAll();
            },
            onReadAll: function () {
                const that = this;
                const oModel = this.getOwnerComponent().getModel();
                oModel.read("/APPARTMENTSHeadersSet", {
                    success: function(oData) {
                        // console.log(oData);
                        const jModel = new sap.ui.model.json.JSONModel(oData);      
                        that.getView("idProducts").setModel(jModel);
                    },
                    error: function(oError) {
                        console.log(oError);
                    }
                });
            
            }
        });
    });
