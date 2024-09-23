sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
],
function (Controller,Fragment,MessageToast) {
    "use strict";

    return Controller.extend("rbx.week5.107.controller.View1", {
        onInit: function () {
            this._owner=this.getOwnerComponent().getModel();
            this._router=this.getOwnerComponent().getRouter();
            this._owner.setDeferredGroups(this._owner.getDeferredGroups().concat(["create","update"]))
            this.mDialog={}
        },
        onRoute(oEvent){
            this._router.navTo("RouteView2",{
                path:window.encodeURIComponent(oEvent.getSource().getBindingContext().getPath())
            })
        },
        onAdd(){
            var oContext=this._owner.createEntry("/SiteQualification",{groupId:"create"})
            var sDialog="add"
            var oDialog=this.mDialog[sDialog]
            if(!oDialog){
            Fragment.load({
                id:this.getView().getId(),
                name:"rbx.week5.107.fragments.add",
                controller:this
            }).then((oFrag)=>{
                this.getView().addDependent(oFrag);
                this.mDialog[sDialog]=oFrag
                oFrag.setBindingContext(oContext)
                oFrag.open();
            })
        }else{
            oDialog.setBindingContext(oContext)
            oDialog.open();
        }
    },
    onSelectionChange(oEvent){
      oEvent.getSource().getParent().getToolbar().getContent()[4].setEnabled(oEvent.getSource().getSelectedItems().length>0)
    },
        onDelete(oEvent){
            var oTab=this.getView()
            var oSmart=this.byId("smarttable")
            var oTable=oSmart.getTable();
            var oSelectedArr=oTable.getSelectedItems()
            oSelectedArr.forEach((oEle)=>{
                var oBind=oEle.getBindingContext().getPath();
                this._owner.remove(oBind,{
                    success:(oData)=>{
                        MessageToast.show("Data deleted successfully")
                        this.byId("del").setEnabled(false)
                    },
                    error:(oErr)=>{
                        MessageToast.show("Error",oErr);
                    }
                })
            })

        },
        onAdding(oEvent){
            this._owner.submitChanges({
                success:(oData)=>{
                    MessageToast.show("Data Added successfully")
                    oEvent.getSource().getParent().getParent().close();
                },
                error:(oErr)=>{
                    MessageToast.show("Error",oErr);
                }
            })
        },
        onCancel(oEvent){
            oEvent.getSource().getParent().getParent().close();
        }
    });
});
