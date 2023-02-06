public with sharing class FormBuilderController {
   
    
        @AuraEnabled(cacheable=true)
        public static List<BaseField_mdt__mdt> GetFieldsMetaData(){
         try {
             List<BaseField_mdt__mdt> basefield = BaseField_mdt__mdt.getAll().values();
             return basefield;
         } catch (Exception e) {
             throw new AuraHandledException(e.getMessage());
         }
        }

        @AuraEnabled(cacheable=true)
        public static StylesWrapper GetStyles(){
            try {
                StylesWrapper sw = new StylesWrapper();
                sw.AlignmentProp = Alignment__mdt.getAll().values();
                sw.BgPositionProp = Background_position__mdt.getAll().values();
                sw.BgRepeatProp = Background_repeat__mdt.getAll().values();
                sw.BgsizeProp = Background_size__mdt.getAll().values();
                sw.BorderStylesProp=Border_styles__mdt.getAll().values();
                sw.FixPosProp = Fix_position__mdt.getAll().values();
                sw.FontProp = Font__mdt.getAll().values();
                sw.FontLineHeightProp = Font_Line_Height__mdt.getAll().values();
                sw.FontStyleProp = Font_Style__mdt.getAll().values();
                sw.FontWeightProp = Font_Weight__mdt.getAll().values();
                sw.FormDirectionProp = Form_Direction__mdt.getAll().values();
                return sw;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

        //Method to get Field's Data
        @Auraenabled(cacheable=true)
        public static List<List<String>> getFields(String id){
            List<String> types= new List<String>();
            Form__c FormDetail = [SELECT Id, Mapped_Objects__c FROM Form__c WHERE Id=:id LIMIT 1];
            types = (FormDetail.Mapped_Objects__c).split(',');
            System.debug(types);
            List<List<String>> allFields = new List<List<String>>();
            for (String type : types) {
	            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
	            Schema.SObjectType leadSchema = schemaMap.get(type);
	            Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
	            List<String> Fields = new List<String>();
	            for (String fieldName: fieldMap.keySet()) {
    	            if (fieldMap.get(fieldName).getDescribe().isUpdateable()){
        	            System.debug('##Field API Name='+fieldName);// list of all field API name
                        Fields.add(fieldMap.get(fieldName).getDescribe().getLabel()+'./.'+ fieldMap.get(fieldName).getDescribe().getType());//It provides to get the object fields label.
                        //It provides to get the object fields label.
                    }
                }
	            allFields.add(Fields);
            }
            System.debug(allFields);
            return allFields;
        }


        @AuraEnabled(cacheable=true)
        public static List<Form_Page__c> GetFormPage(String Form_Id){
            try {
                List<Form_Page__c> pageList = [SELECT Id, Name, Page_Number__c FROM Form_Page__c WHERE Form__c=:Form_Id ORDER BY Page_Number__c ASC];
                return pageList;
         } catch (Exception e) {
             throw new AuraHandledException(e.getMessage());
         }
        }
        public class StylesWrapper{
            @AuraEnabled
            public list<Alignment__mdt> AlignmentProp{get; set;}
            @AuraEnabled
            public list<Background_position__mdt> BgPositionProp{get; set;}
            @AuraEnabled
            public list<Background_repeat__mdt> BgRepeatProp{get;set;}
            @AuraEnabled
            public list<Background_size__mdt> BgsizeProp{get;set;}
            @AuraEnabled
            public list<Border_styles__mdt> BorderStylesProp{get;set;}
            @AuraEnabled
            public list<Fix_position__mdt> FixPosProp{get;set;}
            @AuraEnabled
            public list<Font__mdt> FontProp{get;set;}
            @AuraEnabled
            public list<Font_Line_Height__mdt> FontLineHeightProp{get;set;}
            @AuraEnabled
            public list<Font_Style__mdt> FontStyleProp{get;set;}
            @AuraEnabled
            public list<Font_Weight__mdt> FontWeightProp{get;set;}
            @AuraEnabled
            public list<Form_Direction__mdt> FormDirectionProp{get;set;}
    
        }

        @AuraEnabled(cacheable=false)
        public static List<Form_Fields__c> CreateFieldRecord(String Form_Id,String Name,String Form_Page_Id,Integer Position,boolean isold,String Field_Page_Id){
            try {
                boolean nimit=true;
                if(nimit==true){
                 System.debug('old page id-->'+Form_Page_Id);
                Form_Fields__c field = new Form_Fields__c();
                List<Form_Fields__c> updateList= new List<Form_Fields__c>();
                
                List<Form_Fields__c> fieldList=[SELECT Id,Name,Form__c,Form_Page__c,Field_Order__c FROM Form_Fields__c WHERE Form_Page__c=:Form_Page_Id ORDER BY Field_Order__c ASC ];
                 if(Field_Page_Id!=''){
                    Form_Fields__c field_which_page_changed = [SELECT Id,Name,Form__c,Form_Page__c,Field_Order__c FROM Form_Fields__c WHERE Id=:Name ORDER BY Field_Order__c ASC ];
                    field_which_page_changed.Form_Page__c = Form_Page_Id;
                    update field_which_page_changed;
                 }
                for(Form_Fields__c it: fieldList){
                    if(it.Field_Order__c > Position){
                        if(isold){
                            System.debug(it.Id);
                            System.debug(Name);
                          if(it.Id == Name)  {
                          
                            it.Field_Order__c = Position+1;
                          }
                          else{
                            it.Field_Order__c = it.Field_Order__c+1;
                          }
                        }
                        else{
                            it.Field_Order__c = it.Field_Order__c+1;
                        }
                     
                       updateList.add(it);
                    }
                }
                if(!updateList.isEmpty()){
                    update updateList;
                }
                if(!isold){
                string form = [SELECT Mapped_Objects__c from Form__c WHERE Id=:Form_Id].Mapped_Objects__c;
                List<String> Objects = form.split(',');
                List<String> label  = Name.split(',');
                String firstLabel = label[0];
                System.debug(firstLabel);
                for (String type : Objects) {
                    Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
                    Schema.SObjectType leadSchema = schemaMap.get(type);
                    Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
                    List<String> Fields = new List<String>();
                    for (String fieldName: fieldMap.keySet()) {
                        if (fieldMap.get(fieldName).getDescribe().isUpdateable()){
                         
                           if(fieldMap.get(fieldName).getDescribe().getLabel()==firstLabel){
                            System.debug('##Field API Name='+fieldName);// list of all field API na
                            System.debug('type:=>'+type);
                            field.Mapped_Obj__c = type;
                            field.Field_Mapping__c = fieldName;
                           }
                      
                             
                        }
                    }
                }
                field.Name= Name;
                field.Form__c =  Form_Id;
                field.Form_Page__c = Form_Page_Id;
                field.Field_Order__c = Position+1;
              
                insert field;}
            nimit=false;
               fieldList=[SELECT Id,Name,Form__c,Form_Page__c,Field_Order__c FROM Form_Fields__c ORDER BY Field_Order__c ASC];
            return fieldList;
          
        }
        else return null;
                
                //System.debug('5');
//                      Form_Fields__c field = new Form_Fields__c(Name= 'Account2',Form__c =  'a0B1y00000013pXEAQ',Form_Page__c = 'a091y000004uuFeAAI');
//                 // field.Name= 'Account2';
//                 // field.Form__c =  'a0B1y00000013pXEAQ';
//                 // field.Form_Page__c = 'a091y000004uuFeAAI';
//                // field.Field_Order__c = 2;
// insert field1;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        @AuraEnabled(cacheable=true)
        public static List<Form_Fields__c> getFieldsRecords(){
            try {
                List<Form_Fields__c> fieldList=[SELECT Id,Name,Form__c,Form_Page__c,Field_Order__c FROM Form_Fields__c];
                return fieldList;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
  
        
     }