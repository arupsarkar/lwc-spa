import { LightningElement,api } from 'lwc';
import getSessionDetails from '@salesforce/apex/SessionDetailsController.getSessionDetails';




export default class Sessions extends LightningElement {

    @api ParentMessage
    sessionId
    sessionDetails = {}
    sessionName
    session
    capacity
    manufacturer

    connectedCallback() {
        console.log('---> sessions connectedCallback() message ', this.ParentMessage)
        this.sessionId = this.ParentMessage
        this.getData(this.sessionId)
        //this.locationName = this.ParentMessage.Location__c
    }

    getData(searchParam) {
        getSessionDetails({searchKey : searchParam})
            .then((result) => {
                console.log('---> session details result ', result)
                this.sessionDetails = result
                this.sessionName = this.sessionDetails[0].Name
                this.session = this.sessionDetails[0].Sessions__c
                this.manufacturer = this.sessionDetails[0].Manufacturer__c
                this.capacity = this.sessionDetails[0].Capacity__c
                console.log('---> session details', this.sessionDetails)
                console.log('---> session name ', this.sessionName)
                console.log('---> manufacturer ', this.manufacturer)
            }) 
            .catch((error) => {
                console.log('---> error ', error)
            })
    }
}