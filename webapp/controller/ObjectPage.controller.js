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
                    // Set the Data to the view
                    const jModel = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(jModel);
                    that.getView().bindElement({
                        path: "/"
                    });
                    oModel.read(`/RESERVATIONSHeadersSet`, {
                        success: function(oReservations){
                            const relativeReservations = oReservations.results.filter(r=>r.IdAppartement == sItemId.toUpperCase())
                            console.log(relativeReservations);
                            const oView = that.byId("_IDGenList1")
                            oView.setModel(new JSONModel(relativeReservations), "oListModel")
                            const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "dd.MM.YYYY"});

                            oView.bindAggregation("items", {
                                path: "oListModel>/",
                                template: new sap.m.CustomListItem({
                                    content: [
                                        new sap.m.HBox({
                                            justifyContent: "SpaceBetween",
                                            items: [
                                                new sap.m.Text({
                                                    text: "{oListModel>IdReservation} "
                                                }).addStyleClass("reservation-id"),
                                                new sap.m.HBox({
                                                    items: [
                                                        new sap.m.Button({
                                                            text: "Edit",
                                                            press: function(oEvent) {
                                                                // Handle edit button press here
                                                            }
                                                        }),
                                                        new sap.m.Button({
                                                            text: "Delete",
                                                            press: function(oEvent) {
                                                                // Handle delete button press here
                                                            }
                                                        })
                                                    ]
                                                }).addStyleClass('custom-list-buttons-container')
                                            ]
                                        }),
                                        new sap.m.Text({
                                            text: {
                                                parts: ["oListModel>DateDebut", "oListModel>DateFin"],
                                                formatter: function(sDateDebut, sDateFin) {
                                                    var sFormattedDateDebut = oDateFormat.format(new Date(sDateDebut));
                                                    var sFormattedDateFin = oDateFormat.format(new Date(sDateFin));
                                                    return "A partir du : " + sFormattedDateDebut + " - Jusqu'au : " + sFormattedDateFin;
                                                }
                                            }
                                        }).addStyleClass('custom-list-date'),
                                        new sap.m.Text({
                                            text: "Locataire : {oListModel>CinLocataire}"
                                        }).addStyleClass('custom-list-locataire')
                                        

                                    ],
                                    type: "Active",
                                    press: function() {} // empty press handler to make the item clickable
                                }).addStyleClass('custom-list-item')
                            });
                        }
                    })
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
        onOpenDialog: function () {
            var that = this;
            var oObjectHeader = this.byId("_IDGenObjectHeader1");
            var oObject = oObjectHeader.getBindingContext().getObject();
            const oModel = this.getOwnerComponent().getModel();

            // Create a new dialog
            var oDialog = new sap.m.Dialog({
                title: "APPARTEMENT",
                icon: "sap-icon://home",
                contentWidth: "40%",
                content: [
                    new sap.m.Panel({
                        headerText: "Informations Générales",
                        content: [
                            new sap.m.Label({
                                id: "_IDGenLabel1101",
                                showColon: true,
                                text: "Adresse de l'appartement"
                            }),
                            new sap.m.TextArea({
                                id: "Description",
                                width: "100%",
                                placeholder: "Enter a Description"
                            }).setValue(oObject.Description)
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Détails du bien",
                        content: [
                            new sap.m.Label({
                                id: "_IDGenLabel110",
                                showColon: true,
                                text: "Nombre Total de Piece"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrPieces_input",
                                placeholder: "Nombre total de Piece"
                            }).setValue(oObject.NbrPieces),
                            new sap.m.Label({
                                id: "_IDGenLabel111",
                                showColon: true,
                                text: "Nombre de Chambres"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrChambres_input",
                                placeholder: "Nombre de chambre(s)"
                            }).setValue(oObject.NbrChambres),
                            new sap.m.Label({
                                id: "_IDGenLabel112",
                                showColon: true,
                                text: "Nombre de salles de bain"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "NbrSalleDeBains_input",
                                placeholder: "Nombre de salle(s) de bain"
                            }).setValue(oObject.NbrSalleDeBains),
                            new sap.m.Label({
                                id: "_IDGenLabel113",
                                showColon: true,
                                text: "Superficie de l'appartement en m²"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "Superficie_input",
                                placeholder: "Superficie de l'appartement"
                            }).setValue(oObject.Superficie),
                            new sap.m.Label({
                                id: "_IDGenLabel14",
                                showColon: true,
                                text: "Etage de l'appartement"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Number,
                                id: "_IDGenInput1",
                                placeholder: "Etage"
                            }).setValue(oObject.Etage)
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Autres avantages",
                        content: [
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox3",
                                text: "Avec Garage",
                            }).setSelected(oObject.Garage == 'X' ? true : false),
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox2",
                                text: "Avec Ascenseur",
                            }).setSelected(oObject.Ascenseur == 'X' ? true : false),
                            new sap.m.CheckBox({
                                id: "_IDGenCheckBox1",
                                text: "Avec Climatisation",
                            }).setSelected(oObject.Climatisation == 'X' ? true : false)
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
                            }).setValue(oObject.PrixNuitee)
                        ]
                    })
                ]
                ,
                beginButton: new sap.m.Button({
                    text: "Edit",
                    type: "Accept",
                    icon:"sap-icon://add",
                    press: function () {
                        
                            // Retrieve all the input values
                            var description = sap.ui.getCore().byId("Description").getValue();
                            var nbrPieces = sap.ui.getCore().byId("NbrPieces_input").getValue();
                            var nbrChambres = sap.ui.getCore().byId("NbrChambres_input").getValue();
                            var nbrSalleDeBains = sap.ui.getCore().byId("NbrSalleDeBains_input").getValue();
                            var superficie = sap.ui.getCore().byId("Superficie_input").getValue();
                            var etage = sap.ui.getCore().byId("_IDGenInput1").getValue();
                            var garage = sap.ui.getCore().byId("_IDGenCheckBox3").getSelected() ? "X" : "";
                            var ascenseur = sap.ui.getCore().byId("_IDGenCheckBox2").getSelected() ? "X" : "";
                            var climatisation = sap.ui.getCore().byId("_IDGenCheckBox1").getSelected() ? "X" : "";
                            var prixNuitee = sap.ui.getCore().byId("_IDGenInput5").getValue();

                            const uEntry = {
                                "Description" : description,
                                "NbrPieces" : nbrPieces,
                                "NbrChambres" : nbrChambres,
                                "NbrSalleDeBains" : nbrSalleDeBains,
                                "Superficie" : superficie,
                                "Etage" : etage,
                                "Garage" : garage,
                                "Ascenseur" : ascenseur,
                                "Climatisation" : climatisation,
                                "PrixNuitee" : prixNuitee,
                                // This below is not edited here
                                "Disponible" : oObject.Disponible
                            }

                            // Perform any necessary actions with the retrieved values here...
                            oModel.update(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, uEntry, {
                                success: function(){
                                    oModel.read(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, {
                                        success: function(oData){
                                            const jModel = new sap.ui.model.json.JSONModel(oData);
                                            that.getView().setModel(jModel);
                                            // Update the object page with the new data
                                            // this.onInit();
                                        },
                                        error: function(oErr){
                                            console.log(oErr);
                                        }
                                    });
                                },
                                error:function(oErr){
                                    console.log(oErr);
                                }
                            })
                            // Close and destroy the dialog content
                            oDialog.close();
                            oDialog.destroyContent();
                        
                        oDialog.close();
                        oDialog.destroyContent();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    type: "Reject",
                    icon:"sap-icon://undo",
                    press: function() {
                      // handle button press event...
                      oDialog.close();
                      oDialog.destroyContent();
                    }
                  })

            });
            oDialog.open();
        },
        onBook:function(){
            var oObjectHeader = this.getView();
            var oObject = oObjectHeader.getBindingContext().getObject();
            const oModel = this.getOwnerComponent().getModel();

            console.log(oObject);
            var oDialog = new sap.m.Dialog({
                title: "RESERVER UN APPARTEMENT",
                icon: "sap-icon://home",
                contentWidth: "40%",
                content: [
                    new sap.m.Panel({
                        headerText: "Informations sur Locataire",
                        content: [
                            new sap.m.Label({
                                id: "_IDGenLabel11011",
                                showColon: true,
                                text: "CIN du Locataire"
                            }),
                            new sap.m.Input({
                                id: "_IDCinLocataire",
                                width: "100%",
                                placeholder: "EX: BK681120..."
                            })
                        ]
                    }),
                    new sap.m.Panel({
                        headerText: "Détails de la reservation",
                        content: [
                            new sap.m.Label({
                                id: "_IDGenLabel11010",
                                showColon: true,
                                text: "ID de la Réservation"
                            }),
                            new sap.m.Input({
                                id: "_IDReservation",
                                placeholder: "Entrer ID de la Reservation"
                            }),
                            new sap.m.Label({
                                id: "_IDGenLabel1101",
                                showColon: true,
                                text: "Date de début"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Date,
                                id: "DateDebut_input",
                            }),
                            new sap.m.Label({
                                id: "_IDGenLabel1111",
                                showColon: true,
                                text: "Date de fin"
                            }),
                            new sap.m.Input({
                                type: sap.m.InputType.Date,
                                id: "DateFin_input",
                            })
                        ]
                    })
                ]
                ,
                beginButton: new sap.m.Button({
                    text: "Edit",
                    type: "Accept",
                    icon:"sap-icon://add",
                    press: function () {

                        
                            // Retrieve all the input values
                            var cinLocataire = sap.ui.getCore().byId("_IDCinLocataire").getValue();
                            var dateDebut = sap.ui.getCore().byId("DateDebut_input").getValue();
                            var dateFin = sap.ui.getCore().byId("DateFin_input").getValue();
                            var idReservation = sap.ui.getCore().byId("_IDReservation").getValue();
                            
                            

                            const uEntry = {
                                "IdReservation" : idReservation,
                                "CinLocataire" : cinLocataire,
                                "DateDebut" : new Date(dateDebut),
                                "DateFin" : new Date(dateFin),
                                "IdAppartement" : oObject.Identifiant.toUpperCase()
                            }

                            console.log(uEntry);

                            // Perform any necessary actions with the retrieved values here...
                            oModel.create(`/RESERVATIONSHeadersSet`, uEntry, null, {
                                success: function(res){
                                    console.log("Result from : ", res);
                                    // Print the document
                                    
                                },
                                error: function(oError){
                                    console.log(oError);
                                    oDialog.close();
                                    oDialog.destroyContent();
                                }
                            })
                            oDialog.destroyContent();
                            //     success: function(){
                            //         oModel.read(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, {
                            //             success: function(oData){
                            //                 const jModel = new sap.ui.model.json.JSONModel(oData);
                            //                 that.getView().setModel(jModel);
                            //                 // Update the object page with the new data
                            //                 // this.onInit();
                            //             },
                            //             error: function(oErr){
                            //                 console.log(oErr);
                            //             }
                            //         });
                            //     },
                            //     error:function(oErr){
                            //         console.log(oErr);
                            //     }
                            // })
                            // Close and destroy the dialog content
                        //     oDialog.close();
                        //     oDialog.destroyContent();
                        
                        // oDialog.close();
                        // oDialog.destroyContent();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    type: "Reject",
                    icon:"sap-icon://undo",
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