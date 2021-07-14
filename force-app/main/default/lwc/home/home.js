import { LightningElement, track, wire } from 'lwc'
import getLocations from '@salesforce/apex/LocationsController.getLocations'

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import locationSelected from '@salesforce/messageChannel/Location_Selected__c'

const actions = [
    {label: 'Show Details', name: 'show_details'},
]
const columns = [
    { label: 'Location', fieldName: 'Location__c', type: 'text'},
    {
        type: 'action',
        typeAttributes: {rowActions: actions}
    }
]

export default class Home extends LightningElement {
    queryTerm;
    columns = columns
    locations = {}
    @track errorMsg

    @wire(MessageContext)
    messageContext;

    handleKeyUp(evt) {
        console.log('---> search value ', evt.target.value)
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = evt.target.value;
            this.getData()
        }
    }
    
    getData() {
        getLocations({searchKey : this.queryTerm})
            .then((result) => {
                this.locations = result
                console.log('---> locations ', this.locations)
            })
            .catch((error) => {
                console.log('---> error locations ', error)
            })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name
        const row = event.detail.row
        console.log('---> action name : ', actionName)
        console.log('---> location data', row)

        //publish location selected message
        console.log('---> publishing location selected message with data - Start', row)
        publish(this.messageContext, locationSelected, row)
        console.log('---> publishing location selected message with data - End', row)
        // create the event
        const selectedEvent = new CustomEvent('locationselected', {detail: row})
        // dispatch the event
        this.dispatchEvent(selectedEvent)
    }

}