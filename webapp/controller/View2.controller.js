sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (
	Controller, Fragment, JSONModel, MessageToast, MessageBox
) {
	"use strict";

	return Controller.extend("rbx.week5.107.controller.View2", {
		onInit() {
			this._owner = this.getOwnerComponent().getModel();
			this._router = this.getOwnerComponent().getRouter();
			this._owner.setDeferredGroups(this._owner.getDeferredGroups().concat(["create", "update"]))
			this.mDialog = {}
			this._router.getRoute("RouteView2").attachPatternMatched(this.oRoutes, this)
			var oModel = new JSONModel({ "edit": false })
			this.getView().setModel(oModel, "data")
		},
		_openFragment(path) {
			return Fragment.load({
				id: this.getView().getId(),
				name: path,
				controller: this
			}).then((oFrag) => {
				this.getView().addDependent(oFrag)
				return oFrag
			})
		},
		oRoutes(oEvent) {
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").path)
			this.getView().bindElement({ path: sPath })
		},
		onSaving(oEvent) {
			this._owner.submitChanges({
				success: (oData) => {
					MessageToast.show("Data Updated successfully")
					this.getView().getModel("data").setProperty("/edit", false)

				},
				error: (oErr) => {
					MessageToast.show("Error", oErr);
				}
			})
		},
		onCancel(oEvent) {
			this._owner.resetChanges()
			this.getView().getModel("data").setProperty("/edit", false)
		},
		onEdit(oEvent) {
			this.getView().getModel("data").setProperty("/edit", true)
		},
		onDeleting(oEvent) {
			MessageBox.warning("Are You Confirm to delete",{
				icon: MessageBox.Icon.WARNING,
				title: "Confirm to Delete",
				actions: ["confirm", MessageBox.Action.CANCEL],
				emphasizedAction: "confirm",
				onClose:(oEve)=>{
					if(oEve==="confirm"){
						var oBindingpath=this.getView().getBindingContext().getPath();
						this._owner.remove(oBindingpath,{
							success:(oData)=>{
								this._router.navTo("RouteView1")
								MessageToast.show("Data Deleted Successfully")
							},
							error:(oerr)=>{
								MessageToast.show("error",oerr);
							}
						})
					}
					else{
						MessageBox.Action.CANCEL;
					}
				}
			})

		},
		onAdd(oEvent) {
			var oPath = oEvent.getSource().getBindingContext().getPath()
			var oBj = oEvent.getSource().getBindingContext().getObject()
			var sSmartTableId = oEvent.getSource().getParent().getParent().getId();
			var obj,path,id
			switch (sSmartTableId.slice(-7)) {
				case "sec2Add":
					path="sec2Add"
					obj = {
						Studyid: oBj.Studyid
					}
					break
				case "sec3Add":
					path="sec3Add"
					obj = {
						Studyid: oBj.Studyid,
						sicod: oBj.SiteCode
					}
					break
				case "sec4Add":
					path="sec4Add"
					obj = {
						Studyid: oBj.Studyid,
						sicod: oBj.SiteCode
					}
					break
				case "sec5Add":
					path="sec5Add"
					obj = {
						StudyId: oBj.Studyid,
						SiteCode: oBj.SiteCode
					}
					break
				case "sec6Add":
					path="sec6Add"
					obj = {
						studyid: oBj.Studyid,
						Sitecode: oBj.SiteCode
					}
					break
				case "sec7Add":
					path="sec7Add"
					obj = {
						Studyid: oBj.Studyid,
						SiteCode: oBj.SiteCode
					}
					break
				default:
					console.error("Invalid SmartTable ID: " + sSmartTableId);
			}
			var tableBindingPath = oEvent.getSource().getParent().getParent().getTableBindingPath();
			var oContext = this._owner.createEntry(`${oPath}/${tableBindingPath}`, {
				groupId: "create",
				properties: obj
			})
			var sDialog = "rbx.week5.107.fragments."+path
			var oDialog = this.mDialog[sDialog]
			if (!oDialog) {
				this._openFragment("rbx.week5.107.fragments.".concat(path)).then((oFrg) => {
					oFrg.setBindingContext(oContext);
					this.mDialog[sDialog] = oFrg
					oFrg.open()
				})
			} else {
				oDialog.setBindingContext(oContext)
				oDialog.open();
			}
		},
		onAdd2(oEvent) {
			this._owner.submitChanges({
				success: (oData) => {
					MessageToast.show("Data added successfully")
					oEvent.getSource().getParent().getParent().close()
				},
				error: (oErr) => {
					MessageToast.show("Error", oErr);
				}
			})
		},
		onClose(oEvent) {
			this._owner.resetChanges();
			oEvent.getSource().getParent().getParent().close()
		},
		onSelectionChange(oEvent) {
			oEvent.getSource().getParent().getToolbar().getContent()[3].setEnabled(oEvent.getSource().getSelectedItems().length > 0)
		},
		onDelete(oEvent) {
			var oSmart = oEvent.getSource().getParent().getParent()
			var oTable = oSmart.getTable();
			var oSelectedArr = oTable.getSelectedItems()
			oSelectedArr.forEach((oEle) => {
				var oBind = oEle.getBindingContext().getPath();
				this._owner.remove(oBind, {
					success: (oData) => {
						MessageToast.show("Data Deleted successfully")
						oEvent.getSource().setEnabled(false)
					},
					error: (oError) => {
						MessageToast.show("error", oError)
					}
				})
			})

		}

	});
});