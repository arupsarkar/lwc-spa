import { LightningElement, wire } from 'lwc';
import getSessions from '@salesforce/apex/SessionsController.getSessions'
import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import locationDetails from '@salesforce/messageChannel/Notification__c'
import SESSION_DETAILS_CHANNEL from '@salesforce/messageChannel/Location_Details__c'



const actions = [
    {label: 'Show Details', name: 'show_details'},
]
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text'},
    { label: 'Session', fieldName: 'Session_Name__c', type: 'text'},
    { label: 'Location', fieldName: 'Custom_Location__c', type: 'text'},
    {
        type: 'action',
        typeAttributes: {rowActions: actions}
    }
]


export default class LocationSessions extends LightningElement {

    location = {}
    sessions = {}
    sessionId
    showSessionsData = false
    columns = columns
    locationId
    locationName

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;    
    
    subscribeToMessageChannel() {
        console.log('---> message subscription ', this.subscription)
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                locationDetails,
                (message) => {
                    console.log('---> subscribing to location session selected message', 'start')
                    this.handleMessage(message)
                    console.log('---> subscribing to location session selected message', 'end')
                },
                {scope: APPLICATION_SCOPE}
            );
        }
    }
    // Handler for message received by component
    handleMessage(message) {
        this.location = message
        this.locationId = message.Id
        this.locationName = message.Location__c
        console.log('---> location message received in location session component', this.location)
        this.getData(this.location.Id)
    }        

    connectedCallback() {
        console.log('---> location session connected callback() ', ' start')
        this.subscribeToMessageChannel()
        console.log('---> location session connected callback() ', ' end ')

    }

    getData(searchParam) {
        console.log('---> search detail key ', searchParam)
        getSessions({searchKey : searchParam})
            .then((result) => {
                console.log('---> sessions ', result)
                
                this.sessions = result
                if(this.sessions.Id != '')  {
                    this.showSessionsData = true
                }

            })
            .catch((error) => {
                console.log('---> Error ', error)
            })
    }    

    handleRowAction(event) {
        const actionName = event.detail.action.name
        const row = event.detail.row
        this.sessionId = row.Id
        console.log('---> action name : ', actionName)
        if(actionName == 'show_details') {
            console.log('---> pusblishing session id message - Start', this.sessionId)
            publish(this.messageContext, SESSION_DETAILS_CHANNEL, row)
            console.log('---> pusblishing session id message - Complete', this.sessionId)
            
        }
    }    
    


}