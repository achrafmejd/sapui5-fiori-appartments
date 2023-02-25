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
            var oObject;
            oModel.read(`/APPARTMENTSHeadersSet('${sItemId}')`, {
                success: function (oData) {
                    console.log(oData);
                    oObject = oData;
                    // Set the Data to the view
                    const jModel = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(jModel);
                    that.getView().bindElement({
                        path: "/"
                    });
                    oModel.read(`/RESERVATIONSHeadersSet`, {
                        success: function (oData) {
                            that.onUpdateReservation(oData, sItemId, that, oObject)
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
                    icon: "sap-icon://add",
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
                            "Description": description,
                            "NbrPieces": nbrPieces,
                            "NbrChambres": nbrChambres,
                            "NbrSalleDeBains": nbrSalleDeBains,
                            "Superficie": superficie,
                            "Etage": etage,
                            "Garage": garage,
                            "Ascenseur": ascenseur,
                            "Climatisation": climatisation,
                            "PrixNuitee": prixNuitee,
                            // This below is not edited here
                            "Disponible": oObject.Disponible
                        }

                        // Perform any necessary actions with the retrieved values here...
                        oModel.update(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, uEntry, {
                            success: function () {
                                oModel.read(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, {
                                    success: function (oData) {
                                        const jModel = new sap.ui.model.json.JSONModel(oData);
                                        that.getView().setModel(jModel);
                                        // Update the object page with the new data
                                        // this.onInit();
                                    },
                                    error: function (oErr) {
                                        console.log(oErr);
                                    }
                                });
                            },
                            error: function (oErr) {
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
                    icon: "sap-icon://undo",
                    press: function () {
                        // handle button press event...
                        oDialog.close();
                        oDialog.destroyContent();
                    }
                })

            });
            oDialog.open();
        },
        onBook: function () {
            /* Function : Create Reservation */
            const that = this;
            /* Get the Main Object which is the Appartment */
            var oObjectHeader = this.getView();
            var oObject = oObjectHeader.getBindingContext().getObject();
            console.log(oObject);
            /* Create a Model */
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGW_AME_APPARTMENTS_SRV/");
            /* Create a Dialog to Create reservation */
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
                ],
                beginButton: new sap.m.Button({
                    text: "Proceder",
                    type: "Accept",
                    
                    icon: "sap-icon://add",
                    press: function () {
                        // Retrieve all the input values
                        var cinLocataire = sap.ui.getCore().byId("_IDCinLocataire").getValue();
                        var dateDebut = sap.ui.getCore().byId("DateDebut_input").getValue();
                        var dateFin = sap.ui.getCore().byId("DateFin_input").getValue();
                        var idReservation = sap.ui.getCore().byId("_IDReservation").getValue();

                        const uEntry = {
                            "IdReservation": idReservation,
                            "CinLocataire": cinLocataire,
                            "DateDebut": new Date(dateDebut),
                            "DateFin": new Date(dateFin),
                            "IdAppartement": oObject.Identifiant.toUpperCase()
                        }
                        // Perform any necessary actions with the retrieved values here...
                        oModel.create(`/RESERVATIONSHeadersSet`, uEntry, {
                            success: function () {
                                // Update the Appartment disponible field to indisponible;
                                oObject.Disponible = ''
                                oModel.update(`/APPARTMENTSHeadersSet('${oObject.Identifiant}')`, oObject, {
                                    success: function () {
                                        console.log("App modified");
                                        that.getView().setModel(new sap.ui.model.json.JSONModel(oObject));

                                    },
                                    error: function () {
                                        console.log("Error in edit App");
                                    }
                                })
                                // Update the Reservations
                                oModel.read(`/RESERVATIONSHeadersSet`, {
                                    success: function (oData) {
                                        that.onUpdateReservation(oData, oObject.Identifiant, that, oObject)
                                    },
                                    error: function (oErr) {
                                        console.log(oErr);
                                    }
                                })
                            },
                            error: function (oError) {
                                console.log("Error : ", oError);
                                oDialog.destroyContent()
                                oDialog.close()
                            }
                        })


                        oDialog.destroyContent();
                        oDialog.close()
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    type: "Reject",
                    icon: "sap-icon://undo",
                    press: function () {
                        // handle button press event...
                        oDialog.close();
                        oDialog.destroyContent();
                    }
                })

            });
            oDialog.open();
        },
        onUpdateReservation: function (oReservations, sItemId, that, object = {}) {
            console.log("CALLED CALLED", sItemId);
            const relativeReservations = oReservations.results.filter(r => r.IdAppartement == sItemId.toUpperCase())
            console.log(relativeReservations);
            const oView = that.byId("_IDGenList1")
            oView.setModel(new JSONModel(relativeReservations), "oListModel")
            const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.YYYY" });

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
                                            text: "",
                                            icon: "sap-icon://print",
                                            type: "Accept",
                                            press: function (oEvent) {
                                                const reservation = {
                                                    id: oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("IdReservation"),
                                                    app: oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("IdAppartement"),
                                                    cin: oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("CinLocataire"),
                                                    debut: new Date(oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("DateDebut")).toLocaleDateString('en-GB'),
                                                    fin: new Date(oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("DateFin")).toLocaleDateString('en-GB'),
                                                    nbr_nuits: that._numberOfdays(new Date(oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("DateFin")), new Date(oEvent.getSource().getParent().getParent().getBindingContext("oListModel").getProperty("DateDebut")))
                                                }
                                                console.log(reservation);
                                                console.log(object);
                                                // Create a new instance of jspdf
                                                var doc = new jsPDF();
                                                doc.setFont('helvetica');
                                                doc.setFontSize(10);

                                                const img = new Image();
                                                img.src = '/media/logo_inetum.jpg';
                                                img.onload = () => {
                                                    // await for the image to be fully loaded
                                                    doc.addImage(img, 'JPG', 10, 10, 50, 40);
                                                
                                                    // Add the company information
                                                    doc.setFontSize(14);
                                                    doc.setFont("helvetica", "bold");
                                                    doc.text('ZOUHIR & MEJD Agency', 70, 20);
                                                    doc.setFontSize(10);
                                                    doc.text('Bouskoura', 70, 30);
                                                    doc.text('Hay al Andalous', 70, 35);
                                                    doc.text('(212) 05 22 52 50 22', 70, 40);
                                                    doc.text('contact@z&m-llc.com', 70, 45);
    
                                                    // Add the invoice date and due date
                                                    doc.setFontSize(10);
                                                    doc.text('Date:', 150, 20);
                                                    doc.text(`${new Date().toLocaleDateString('en-GB')}`, 170, 20);
                                            
                                                    // Add the customer information
                                                    doc.setFontSize(14);
                                                    doc.text('FACTURE AU PROFIT DE:', 10, 70);
                                                    doc.setFontSize(10);
                                                    doc.text(`Madame/Monsieur, Detenteur de la CIN : ${reservation.cin}`, 10, 80);
                                         
                                                    // Add the table header
                                                    doc.setFontSize(12);
                                                    doc.setFillColor(204, 204, 204);
                                                    doc.rect(10, 120, 190, 10, 'F');
                                                    doc.setTextColor(255, 255, 255);
    
                                                    doc.text('Reservation', 12, 126);
                                                    doc.text('Appartement', 50, 126);
                                                    doc.text('A partir de', 110, 126);
                                                    doc.text("Jusqu'au", 150, 126);
                                                    doc.text('Nbr Nuits', 180, 126);
                                                    doc.setTextColor(0, 0, 0);
    
                                                    // Add the table rows
                                                    var startY = 135;
                                                    var items = [
                                                        {
                                                            item: `#${reservation.id}`,
                                                            description: `#${reservation.app}`,
                                                            from: `${reservation.debut}`,
                                                            to: `${reservation.fin}`,
                                                            nbr: `${reservation.nbr_nuits}`
                                                        },
                                                    ];
    
                                                    for (var i = 0; i < items.length; i++) {
                                                        var item = items[i];

                                                        doc.text(item.item, 12, startY);
                                                        doc.text(item.description, 50, startY);
                                                        doc.text(item.from, 110, startY);
                                                        doc.text(item.to, 150, startY);
                                                        doc.text(item.nbr, 180, startY);
                                                        startY += 10;
                                                    }
                                                    doc.text('Signatures', 12, doc.internal.pageSize.height - 40);
    
                                                    // Add the table footer
                                                    doc.setFillColor(204, 204, 204);
                                                    doc.rect(10, startY, 190, 10, 'F');
                                                    doc.setTextColor(255, 255, 255);
                                                    doc.text('Total à payer', 150, startY + 6);
                                                    doc.text(parseInt(reservation.nbr_nuits) * parseInt(object.PrixNuitee) + " MAD", 180, startY + 6);
    
                                                    // Add the signature section
                                                    var signatureY = doc.internal.pageSize.height - 50;
                                                    doc.setLineWidth(0.5);
                                                    doc.line(12, signatureY + 5, 70, signatureY + 5);
    
                                                    // / Save the PDF file
                                                    doc.save(`Facture[${reservation.id}].pdf`);
                                                };

                                            }
                                        })
                                    ]
                                }).addStyleClass('custom-list-buttons-container')
                            ]
                        }),
                        new sap.m.Text({
                            text: {
                                parts: ["oListModel>DateDebut", "oListModel>DateFin"],
                                formatter: function (sDateDebut, sDateFin) {
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
                    press: function () { } // empty press handler to make the item clickable
                }).addStyleClass('custom-list-item')
            });
        },
        _numberOfdays: function (date_1, date_2) {
            let difference = date_1.getTime() - date_2.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
    });

})