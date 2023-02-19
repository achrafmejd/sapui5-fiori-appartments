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
        formatPrice: function (price, currency) {
            if (typeof price === "string") {
                price = parseInt(price, 10);
            }
            return new sap.ui.model.type.Currency().formatValue([price, currency], "string");
        },
        onDelete: function () {
            // Delete Item from tables
            var oObjectHeader = this.byId("_IDGenObjectHeader1");
            const oModel = this.getOwnerComponent().getModel();
            var oObject = oObjectHeader.getBindingContext().getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            sap.m.MessageBox.show(
                "Are you sure you want to delete this item?",
                {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Delete",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            // Delete item logic here
                            //   that.deleteItem();
                            console.log(oObject);
                            oModel.remove(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, {
                                success: function () {
                                    oRouter.navTo("RouteView1");
                                }
                            })
                        }
                    }
                })
        },
        onEdit: function () {


        },
        onOpenDialog: function () {
            var that = this;

            // Create a new dialog
            var oDialog = new sap.m.Dialog({
                title: "APPARTEMENT",
                icon: "sap-icon://home",
                contentWidth: "40%",
                content: [
                    new sap.m.Panel({
                        headerText: "Informations Générales",
                        content: [
                            new sap.m.Input({
                                type: sap.m.InputType.Text,
                                id: "Identifiant11",
                                placeholder: "Enter ID",
                                required: true
                            }),
                            new sap.m.TextArea({
                                id: "Description",
                                width: "100%",
                                placeholder: "Enter a Description"
                            })
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Détails du bien",
                        content: [
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrPieces_input",
                                placeholder: "Nombre total de Piece"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrChambres_input",
                                placeholder: "Nombre de chambre(s)"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrSalleDeBains_input",
                                placeholder: "Nombre de salle(s) de bain"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "Superficie_input",
                                placeholder: "Superficie de l'appartement"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "_IDGenInput1",
                                placeholder: "Etage"
                            })
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Autres avantages",
                        content: [
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox3",
                                text: "Avec Garage",
                                selected: true
                            }),
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox2",
                                text: "Avec Ascenseur",
                                selected: true
                            }),
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox1",
                                text: "Avec Climatisation",
                                selected: true
                            })
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Disponibilité et Tarif",
                        content: [
                            new sap.m.Label({
                                id: "_IDGenLabel11",
                                showColon: true,
                                text: "Prix/Nuitée en MAD"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "_IDGenInput5",
                                placeholder: "Prix"
                            }),
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox0",
                                text: "Disponible à partir du moment de l'enregistrement",
                                selected: true
                            })
                        ]
                    })
                ]
                ,
                beginButton: new sap.m.Button({
                    text: "Save",
                    press: function () {
                        // handle button press event...
                        oDialog.close();
                        oDialog.destroyContent();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function() {
                      // handle button press event...
                      oDialog.close();
                      oDialog.destroyContent();
                    }
                  })

            });

            oDialog.open();
        }
    });

})