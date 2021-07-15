import { LightningElement, wire } from 'lwc';

import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import locationSelected from '@salesforce/messageChannel/Location_Selected__c'
import NOTIFICATION_CHANNEL from '@salesforce/messageChannel/Notification__c'
import SESSION_DETAILS_CHANNEL from '@salesforce/messageChannel/Location_Details__c'


export default class Main extends LightningElement {

    showHome = false
    showSessions = false
    showDetails = false
    activeSectionMessage = ''

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;    
    
    subscribeToMessageChannel() {
        console.log('---> message subscription ', this.subscription)
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                locationSelected,
                (message) => {
                    console.log('---> subscribing from main selected message', 'start')
                    this.handleMessage(message)
                    console.log('---> subscribing from main selected message', 'end')
                },
                {
                    scope: APPLICATION_SCOPE
                }
            );
        }
    }
    // Handler for message received by component
    handleMessage(message) {
        this.location = message
        this.locationId = message.Id
        this.locationName = message.Location__c
        console.log('---> location message received in main component', this.location)
        publish(this.messageContext, NOTIFICATION_CHANNEL, this.location)
    }        

    constructor()  {
        super()
        console.log('---> constructor ', 'Start')
        console.log('---> constructor ', 'End')
    }

    connectedCallback() {
        console.log('---> connectedCallback ', 'Start')
        this.subscribeToMessageChannel()
        console.log('---> connectedCallback ', 'End')
    }

    showLocations() {
        this.showHome = true

        this.showSessions = false
        this.showDetails = false

    }

    showLocationSessions() {
        this.showSessions = true

        this.showDetails = false
        this.showHome = false
    }

    showSessionDetails() {
        this.showDetails = true

        this.showHome = false
        this.showSessions = false

    }

    publishMessage() {
        console.log('---> publishing from main component', 'Start')
        console.log('---> main comp this.messageContext ', this.messageContext)
        console.log('---> main comp NOTIFICATION_CHANNEL', NOTIFICATION_CHANNEL)
        console.log('---> main comp this.location', this.location)
        publish(this.messageContext, NOTIFICATION_CHANNEL, this.location)
        console.log('---> publishing from main component', 'end')
    }

    handleToggleSection(event) {
            this.activeSectionMessage =
                'Open section name:  ' + event.detail.openSections;
    }
    // renderedCallback() {
    //     console.log('---> renderedCallback ', 'Start')
    //     console.log('---> renderedCallback ', 'End')        
    // }

    // render() {
    //     console.log('---> render ', 'Start')
    //     console.log('---> render ', 'End')        
    // }

    disconnectedCallback() {
        console.log('---> disconnectedCallback ', 'Start')
        this.showHome = false
        this.showSessions = false
        this.showDetails = false
        console.log('---> disconnectedCallback ', 'End')        
    }

    errorCallback(error, stack) {
        console.log('---> error ', error)
        console.log('---> stack ', stack)                
    }

}