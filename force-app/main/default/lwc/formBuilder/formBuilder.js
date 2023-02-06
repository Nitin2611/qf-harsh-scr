import { LightningElement, track, wire, api } from 'lwc';

import GetFormPage from '@salesforce/apex/FormBuilderController.GetFormPage';
import HomeIcon from '@salesforce/resourceUrl/leftbar_home';
import FieldIcon from '@salesforce/resourceUrl/leftbar_fieldmapping';
import DesignIcon from '@salesforce/resourceUrl/leftbar_design';
import notificationIcon from '@salesforce/resourceUrl/leftbar_notification';
import ThankyouIcon from '@salesforce/resourceUrl/leftbar_thankyou';
import object from '@salesforce/resourceUrl/leftbar_objectmapping';
import PreviewIcon from '@salesforce/resourceUrl/leftbar_preview';
import PublishIcon from '@salesforce/resourceUrl/leftbar_publish';
import getFieldsRecords from '@salesforce/apex/FormBuilderController.getFieldsRecords';
import CreateFieldRecord from '@salesforce/apex/FormBuilderController.CreateFieldRecord';
import Add_icon from '@salesforce/resourceUrl/Add_icon';
import Edit_page_icon from '@salesforce/resourceUrl/Edit_page_icon';
import Edit_icon from '@salesforce/resourceUrl/Edit_icon';
import Delete_icon from '@salesforce/resourceUrl/Delete_icon';

import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

export default class FormBuilder extends NavigationMixin(LightningElement)  {
    
    
    @track spinnerDataTable = true;
    //     icons        // 
    @track homeIcon = HomeIcon;
    designIcon = DesignIcon;
    DeleteIcon = Delete_icon;
    thankyouicon = ThankyouIcon;
    publishIcon = PublishIcon;
    editpageIcon = Edit_page_icon;
    addIcon = Add_icon;
    EditIcon = Edit_icon;
    object =object;
    fieldicon = FieldIcon;
    notificationicon = notificationIcon;
    previewIcon = PreviewIcon;
   



    @api ParentMessage = '';
    @api FormName = 'Test Form_1';
    
    @track MainList = [];
    WieredResult;
    imageSpinner = false;
    pageImageSpinner = false;
    notShowField = true;
    showField = false;
    @track activeDropZone = true;
    @track FormId = this.ParentMessage;
    //dropzone variables
     count=0;
    @track activeDesignsidebar = false;
    @track activesidebar = false;
    @track activeNotification = false;
    @track activethankyou = false;
    @track PageList = [];
    @track FormTitle = 'tempvlaue';
    @track FieldList = [];
   // Id = this.ParentMessage;// Change When LMS Service Starts
    Id='a0B1y00000013pXEAQ'
    EditButtonName = "Edit"//"{!'form:::'+v.FormId}"
    nextButton = 'NextButton';
    previousButton = 'previousButton';
    @track index = 0;
    fieldcount  = 0;
     removeObjFields = [];
    // get isIndexZero() {

    //     if (this.index == 0) {
    //         this.index += 1;
    //         return true;
    //     }
    //     return false;
    // }
    // get isIndexIsNotLast() {

    //     if (this.index != this.PageList.length - 1) {
    //         this.index += 1;
    //         return true;
    //     }
    //     return false;
    // }
    // get isIndexLast() {
    //     if (this.index == this.PageList.length - 1) {
    //         return true;
    //     }
    //     return false;
    // }

    connectedCallback() {

        GetFormPage({ Form_Id: this.Id })
            .then(result => {
                console.log('get form page called');
                this.PageList = result;
                console.log('this-->>');
                console.log(this.PageList[0].Name);
                console.log(this.PageList.length);

            }).catch(error => {
                console.log(error);
            });
        this.secondmethod();
        this.spinnerDataTable = false;
    }
  
    handleActive(event) {
       
        console.log(event.currentTarget.dataset.title);
        console.log('inside onclick'); 
        
       
        var allDiv  = this.template.querySelectorAll('.sidebar');
        var temp111 = this.template.querySelectorAll('.pageButtonMenu');
        console.log(temp111.length);
        console.log(allDiv.length);
        for(var i=0;i<allDiv.length;i++){
            if( event.currentTarget.id==allDiv[i].id){
                console.log(allDiv[i].id);
             allDiv[i].style = 'background-color:#b3cce6';
            }
            else{
                allDiv[i].style  = 'background-color:none';
            }
        }
       
         console.log(event.currentTarget.title);
         console.log('check if condition-=->');
       if (event.currentTarget.dataset.title == 'tab-2' || event.currentTarget.dataset.title == 'tab-3') {
        console.log('in tab-2 or tab-3 code-->');
           if (event.currentTarget.dataset.title == 'tab-2') {
               this.activesidebar = true;
               this.activeDesignsidebar = false;
               this.activeNotification = false;
               this.activethankyou = false;
           }

           else if (event.currentTarget.dataset.title == 'tab-3') {
               this.activeDesignsidebar = true;
               this.activesidebar = false;
               this.activeNotification = false;
               this.activethankyou = false;
           }


           console.log('in the if condition');

           this.activeDropZone = true;
           console.log(this.activeDropZone);
       }

       else if (event.currentTarget.dataset.title == 'tab-4') {
           console.log('Tab-4');
           this.activeDesignsidebar = false;
           this.activesidebar = false;
           this.activeDropZone = false;
           this.activeNotification = true;
           this.activethankyou = false;
       }
       
       else if (event.currentTarget.dataset.title == 'tab-5') {
           this.activeDesignsidebar = false;
           this.activesidebar = false;
           this.activeDropZone = false;
           this.activeNotification = false;
           this.activethankyou = true;
       }
       else if (event.currentTarget.dataset.title == 'tab-6') {
        this.activeDesignsidebar = false;
        this.activesidebar = false;
        this.activeDropZone = false;
        this.activeNotification = false;
        this.activethankyou = false;
    }
    else if (event.currentTarget.dataset.title == 'tab-7') {
        this.activeDesignsidebar = false;
        this.activesidebar = false;
        this.activeDropZone = false;
        this.activeNotification = false;
        this.activethankyou = false;
    }
    else if (event.currentTarget.dataset.title == 'tab-8') {
        this.activeDesignsidebar = false;
        this.activesidebar = false;
        this.activeDropZone = false;
        this.activeNotification = false;
        this.activethankyou = false;
    }

       else {
           this.activesidebar = false;
           this.activeDropZone = false;
           this.activeDesignsidebar = false;

       }
    }

    dragLeave() {

    }
    onDragOver(event) {
        var dropzone = this.template.querySelector('.example-dropzone');
        dropzone.style = "opacity:1.0";
        event.preventDefault();
    }

    onDragStart(event){
        try {
      
            var DraggedLabel = event.target.dataset.record;
            var classname = event.target.className;
            var pageId = event.target.dataset.pageRecord;
            var SenddataObj = {record:DraggedLabel , type:classname, PageId:pageId};
           console.log(DraggedLabel);
           
           console.log('On drag start-->');
            if (DraggedLabel == null) {
                
                onDragOver();
            } else {
                console.log('in else condition');
              //console.log(JSON.stringify(event.target.dataset));
                event.dataTransfer.setData('text/plain',JSON.stringify(SenddataObj));
                
               
            }
        } catch (e) {
            console.log(e)
           console.log("Error", "Error Occur", "Something went wrong to drag the field");
        }

    }
    async onDrop(event) {
        let Fieldid = event.dataTransfer.getData('text');
        let FieldLabel = JSON.parse(Fieldid);
        var classname = event.target.className;
        var pageIdOfField = '';
        var PageRecordId = event.target.dataset.pageRecord;
        var position = 0;
        var OldFieldSend = false;
        var dropzone = this.template.querySelectorAll('.example-dropzone');
        let fieldLabelOfRemovedFeild = FieldLabel.record;

        console.log('Dropzone length' + dropzone.length);
        console.log(classname);
        console.log({FieldLabel});
        console.log('ondrop start-->');
        console.log(Fieldid);
        console.log('parent class->'+event.target.parentElement.className);


        if (classname == 'field') {
            if(FieldLabel.type == 'field')
            {   OldFieldSend = true;
                pageIdOfField = FieldLabel.PageId;
                position = event.target.dataset.orderId-1;
                console.log(pageIdOfField);
            }
            else{
            position = event.target.dataset.orderId;
            }
            console.log('position :- ' + position);
        }

        if(classname==''){
            classname= event.target.parentElement.className;
            PageRecordId = event.target.parentElement.dataset.pageRecord;
            if(FieldLabel.type == 'field')
            {   OldFieldSend = true;
                pageIdOfField = FieldLabel.PageId;
                console.log(pageIdOfField);
                console.log(PageRecordId);
                position = event.target.parentElement.dataset.orderId-1;
                
            }
            else{
                position = event.target.parentElement.dataset.orderId;
            }
         
             console.log(classname);
        }

        console.log(event.target.dataset);
        console.log(PageRecordId);
        console.log(FieldLabel);
        console.log(FieldLabel.record);
        console.log(FieldLabel.type);
        var FieldName = FieldLabel.record;


        if (FieldLabel.type != 'Extra'&& FieldLabel.type!='field') {
            FieldName = FieldName + ',' + FieldLabel.type;
            
        }
        console.log('field label type------->'+FieldLabel.type);
        if(FieldLabel.type=='Extra'){
           
            this.checkCount(FieldName);
            console.log('get count successfully-->',this.count);
            FieldName = FieldName + ',' + FieldLabel.type+','+this.count;
             
              
            console.log('inside field extra');
             
        }

        var FieldElement = document.querySelectorAll('.field');

        await this.SaveFields(FieldName, PageRecordId,position,OldFieldSend,pageIdOfField,fieldLabelOfRemovedFeild);
        var dropzone = this.template.querySelector('.example-dropzone');
        dropzone.style = "opacity:1.0";
        console.log('both methods are called and finish');
    }


    secondmethod() {
        getFieldsRecords()
            .then(result => {
                console.log('whyyyy');
                this.FieldList = result;
                this.setPageField(result);
                 
                console.log(this.FieldList.length);
            })
            .catch(error => {
                console.log(error);
            });
    }
    async SaveFields(FieldName, pageId,position,OldFieldSend,fieldPageId,fieldlabelname) {
        console.log('inside saveField');
        console.log(pageId);
        console.log(fieldPageId);

        CreateFieldRecord({
            Form_Id: 'a0B1y00000013pXEAQ',
            Name: FieldName,
            Form_Page_Id: pageId,
            Field_Page_Id:fieldPageId,
            Position: position,
            isold:OldFieldSend
        }).then(result => {
            this.FieldList = result;
            this.setPageField(result);
           
        }).catch(err => {
            console.log(err);
        });
        this.template.querySelector("c-fields-section-component").removeField(fieldlabelname);
        console.log('log---------------->'+this.template.querySelector("c-fields-section-component"));
    }
    passToParent(event) {
        if (event.detail == true) {

            console.log('in pass to parent');

            // var dropzone = document.querySelector('div');
            var dropzone = this.template.querySelectorAll('.example-dropzone');

            console.log({ dropzone });
            console.log('drop zone length' + dropzone.length);
            console.log(JSON.stringify(dropzone));
            if (dropzone.length == 0) {
                console.log('inside dropzone');
                dropzone.style = "opacity:0.8";
                dropzone.style = 'width :95%';
                dropzone.style = "border: 1px dashed #3298c8";
                dropzone.style = 'padding:5%';
                dropzone.style = 'left:4%';
                dropzone.innerHTML = "Drop Here";
                dropzone.style = 'textAlign:center';
                dropzone.style = "fontSize:1rem";
                dropzone.style = "color :#3298c8";
            }
            else {
                dropzone.style = "opacity:0.4";
            }


        }
    }
    setPageField(fieldList) {
        console.log('in set PageField');
        let outerlist = [];
        let isIndexZero= false;
             let islast = false;
             let isnotlast = false;
        for (let i = 0; i < this.PageList.length; i++) {
            let innerlist = [];
            if(i==0){
                isIndexZero = true;
            }
            else if(i==this.PageList.length-1){
                islast= true;
            }
            else if(i!=this.PageList.length-1 ){
                  isnotlast = true;
            }
            for (let j = 0; j < fieldList.length; j++) {

                if (this.PageList[i].Id == fieldList[j].Form_Page__c) {
                    console.log('inside inner loop');
                   let fieldofObj =  fieldList[j].Name.split(',');
                   console.log('in setpage field----->'+fieldofObj);
                   if(fieldofObj.length==2){
                    console.log(fieldofObj.length);
                     if(fieldofObj[1]!='Extra' && fieldofObj[1]!=undefined && fieldofObj[1]!='undefined'){
                        console.log(fieldofObj[0]);
                        this.removeObjFields.push(fieldofObj[0]);
                     }
                 }
                    innerlist.push(fieldList[j]);
                }
            }
            
            let temp = { pageName: this.PageList[i].Name, pageId: this.PageList[i].Id,isIndexZero:isIndexZero,isIndexLast:islast,isIndexIsNotLast:isnotlast,FieldData: innerlist };
            isIndexZero=false;
            islast = false;
            isnotlast = false;
            outerlist.push(temp);
        }

        this.MainList = outerlist;
    }

    tempararyfun(){
        for(let i=0;i<this.removeObjFields.length;i++){
            console.log('log---------------->'+this.template.querySelector("c-fields-section-component"));
            this.template.querySelector("c-fields-section-component").removeField(this.removeObjFields[i]);
          
        }
    }
    checkCount(fieldname){
        console.log('fieldList--->'+this.FieldList.length);
        let fieldAttributeList=[];
        let count1=0;
      for(let i=0;i<this.FieldList.length;i++){
            var tmmp = this.FieldList[i].Name;
            fieldAttributeList  =tmmp.split(',');
           if(fieldAttributeList.length==3){
            console.log('in if condition ------>>>>');
            if(fieldAttributeList[0]== fieldname){
                count1 = count1+1;
            }
           }
      } 
      console.log('after for loop-->');
         this.count=count1 ;
    }
    renderedCallback() {
        console.log('inside the renderedcallBack--->>>');
        console.log(this.removeObjFields.length);
        this.tempararyfun();
   
    }
}