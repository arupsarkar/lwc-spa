public with sharing class SessionDetailsController {
    public SessionDetailsController() {

    }

    @AuraEnabled(cacheable=true)
    public static list<Session_Details__c> getSessionDetails(String searchKey){
        List<Session_Details__c> sessionDetailsResults = new List<Session_Details__c>();
        try {
            
            System.debug(LoggingLevel.DEBUG, '---> search param ' + searchKey);

            sessionDetailsResults = [SELECT Id, Name, Capacity__c, Manufacturer__c, Sessions__c
                                                    FROM Session_Details__c
                                                    WHERE Sessions__c = :searchKey];
            if(sessionDetailsResults.isEmpty()) {
                throw new AuraHandledException('Session Details not found, try a new session ...');
            }
            return sessionDetailsResults;
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error : ' + ex.getMessage());
            return sessionDetailsResults;
        }
    }        
}
