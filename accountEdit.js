import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';

import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

const fields = [NAME_FIELD, TYPE_FIELD];



export default class AccountEdit extends LightningElement {
    @api recordId;
    @api objectApiName; 

    //this wire can be skipped if you arent using get name and get type anywhere which is commented
    @wire(getRecord, { recordId : '$recordId', fields })
    account;
    //these properties will carry  the value entered in HTML and later be used to send to SF
    name;
    type;
    nameCount;
   
    //this is used when you want to output the values from SF onto component without
    // using Apex
    /*
    get name(){
        return getFieldValue(this.account.data, NAME_FIELD);
    }
    get type(){
        return getFieldValue(this.account.data, TYPE_FIELD);
    }
    */
    handleChange(event){
        console.log('Change event logged');
        if(event.target.name === "name"){
            this.name = event.target.value;
            this.nameCount = this.name.length;
        }else if(event.target.name === "type"){
            this.type = event.target.value;
        }
        //this.accName = event.target.value;
        //console.log('New Name '+this.accName);
        console.log('New name from getter '+this.name);
        console.log('New Type from getter '+this.type);


    }
    
    // as you click on updateAccount you can use first check the length of Name, then throw
    //error if the count is greater than 10 otherwise update
    handleSubmit(event){
        console.log('Event submitted');
        
        event.preventDefault();

        const inputCmp = this.template.querySelector(".nameInput");
        //const value = inputCmp.value;
        const value = this.nameCount;

        //if(!value.includes("ABC")){
        if(value > 10){   
            inputCmp.setCustomValidity("Count should be below 10");

        }else{
            inputCmp.setCustomValidity(""); 
            //const fields = event.detail.fields;
            //fields.Name = this.accName;
            const fields = {};
            //there are many ways to send the values into this fields array
            // we will use this to send this array into updateRecord which can update in org
            //without any Apex
            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[NAME_FIELD.fieldApiName] = this.name;
            fields[TYPE_FIELD.fieldApiName] = this.type;

            const recordInput = {
                fields: fields
            };

            updateRecord(recordInput).then((record) => {
                console.log(record);
            });

            //this.template.querySelector('lightning-record-edit-form').submit(fields);
        }
        inputCmp.reportValidity(); 

    }

}

