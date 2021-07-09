import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    queryTerm;

    handleKeyUp(evt) {
        console.log('---> search value ', evt.target.value)
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = evt.target.value;
        }
    }    
}