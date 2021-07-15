import { LightningElement,api, wire } from 'lwc';
import getSessionDetails from '@salesforce/apex/SessionDetailsController.getSessionDetails';

import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import SESSION_DETAILS_CHANNEL from '@salesforce/messageChannel/Location_Details__c'


export default class Sessions extends LightningElement {

    @api ParentMessage
    sessionId
    sessionDetails = {}
    sessionName
    session
    capacity
    manufacturer

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;    

    subscribeToMessageChannel() {
        console.log('---> message subscription ', this.subscription)
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                SESSION_DETAILS_CHANNEL,
                (message) => {
                    console.log('---> subscribing from session details ', 'start')
                    this.handleMessage(message)
                    console.log('---> subscribing from session details', 'end')
                },
                {scope: APPLICATION_SCOPE}
            );
        }
    }
    // Handler for message received by component
    handleMessage(message) {
        this.sessionId = message.Id
        console.log('---> sesseion details ', this.sessionId)
        this.getData(this.sessionId)
    } 

    connectedCallback() {
        if(this.ParentMessage) {
            console.log('---> sessions connectedCallback() message ', this.ParentMessage)
            this.sessionId = this.ParentMessage
            this.getData(this.sessionId)
        }else {
            this.subscribeToMessageChannel()
        }


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