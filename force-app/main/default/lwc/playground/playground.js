import { LightningElement, track } from 'lwc';

export default class Playground extends LightningElement {

    variable
 
    connectedCallback() {
        this.variable = 'some variable 2'
    }


    sessionsSearch() {
        console.log('---> sessions search', 'Start')
        console.log('---> sessions search', 'End')
    }

    generateSessions() {
        console.log('---> generate sessions', 'Start')
        console.log('---> generate sessions', 'End')
    }

    reviewQueue() {
        console.log('---> review queue', 'Start')
        console.log('---> review queue', 'End')
    }

    immunizationQueue() {
        console.log('---> immunizationQueue', 'Start')
        console.log('---> immunizationQueue', 'End')
    }

    signOffQueue() {
        console.log('---> rsignOffQueue', 'Start')
        console.log('---> signOffQueue', 'End')
    }
}