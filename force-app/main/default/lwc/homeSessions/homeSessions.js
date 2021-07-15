import { LightningElement, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
import getSessions from '@salesforce/apex/SessionsController.getSessions';

import getSessionDetails from '@salesforce/apex/SessionDetailsController.getSessionDetails';
import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import locationSelected from '@salesforce/messageChannel/Location_Selected__c';

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

export default class HomeSessions extends NavigationMixin(LightningElement)  {

    location = {}
    sessions = {}
    sessionId
    showSessionsData = false
    columns = columns

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;    

    connectedCallback() {
        console.log('---> home session connected callback() ', ' start')
        //this.subscribeToMessageChannel()
        console.log('---> home session connected callback() ', ' end ')

    }

    locationSelected(event) {
        this.location = event.detail
        console.log('---> location selected: Location__c', event.detail.Location__c)
        console.log('---> location selected: Id', event.detail.Id)
        this.getData(event.detail.Id)
        
        //this.navigateToDetails()
    }

    navigateToDetails() {
        console.log('---> navigateToDetails()', ' location id ' + this.location.Id)
        console.log('---> navigateToDetails()', ' location ' + this.location.Location__c)
        let sessionDetails = {
            componentDef: "c:sessions",
            attributes: {
                ParentMessage: this.sessionId != '' ? this.sessionId : 'No Session Details Available'
            }
        }
        console.log('---> navigateToDetails() session Details ', sessionDetails)

        let encodedCompDef = btoa(JSON.stringify(sessionDetails))
        
        console.log('---> navigateToDetails() encodedCompDef ', encodedCompDef)

        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: "/one/one.app#" + encodedCompDef
            }
        })
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
        console.log('---> sessions data', row)
        if(actionName == 'show_details') {
            console.log('---> navigate to details page', this.sessionId)
            this.navigateToDetails()
        }
    }
    
    // Pass scope to the subscribe() method.
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                locationSelected,
                (message) => {
                    console.log('---> subscribing to location selected message', 'start')
                    this.handleMessage(message)
                    console.log('---> subscribing to location selected message', 'end')
                },
                { scope: APPLICATION_SCOPE }
            );
        }
    }
    // Handler for message received by component
    handleMessage(message) {
        console.log('---> location message received in home session component', message)
    }        

}