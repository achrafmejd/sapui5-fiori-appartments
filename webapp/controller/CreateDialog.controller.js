sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    // Below for Button Modla

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        
        return Controller.extend("appartments.controller.CreateDialog", {
            onInit: function () {
                // this.onReadAll();
            },
             handleOpen: function () {
                var oDialog = this.getView().byId("helloDialog");
                oDialog.open()
            },
    
            handleClose: function () {
                var oDialog = this.getView().byId("helloDialog");
                oDialog.close();
            },
            handleSubmit: function() {
                var that = this
                var appartmentId = this.getView().byId("Identifiant").getValue();
                var description = this.getView().byId("Description").getValue();
                var nbrPieces = this.getView().byId("NbrPieces_input").getValue();
                var nbrChambres = this.getView().byId("NbrChambres_input").getValue();
                var nbrSalleDeBains = this.getView().byId("NbrSalleDeBains_input").getValue();
                var superficie = this.getView().byId("Superficie_input").getValue();
                var etage = this.getView().byId("_IDGenInput1").getValue();
                var garage = this.getView().byId("_IDGenCheckBox3").getSelected() == true ? 'X' : '';
                var asc = this.getView().byId("_IDGenCheckBox2").getSelected() == true ? 'X' : '';
                var clima = this.getView().byId("_IDGenCheckBox1").getSelected()== true ? 'X' : '';
                var prix = this.getView().byId("_IDGenInput5").getValue();
                var dispo = this.getView().byId("_IDGenCheckBox0").getSelected()== true ? 'X' : '';

                const oEntry = {
                    "Identifiant" : appartmentId,
                    "Description" : description,
                    "NbrPieces" : nbrPieces,
                    "NbrChambres": nbrChambres,
                    "NbrSalleDeBains": nbrSalleDeBains,
                    "Superficie": superficie,
                    "Etage": etage,
                    "Garage": garage,
                    "Ascenseur": asc,
                    "Climatisation": clima,
                    "PrixNuitee": prix,
                    "Disponible" : dispo
                }

                console.log(oEntry);

                const oModel = this.getOwnerComponent().getModel();
                oModel.create('/APPARTMENTSHeadersSet', oEntry, null, {
                    success: function(){
                        console.log("Added");
                    },
                    error: function () {
                        console.log("Non sorry");
                    }
                })
                var oDialog = this.getView().byId("helloDialog");
                oDialog.close();
                
            }
             
        });
    });
