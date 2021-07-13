public with sharing class SessionsController {
    public SessionsController() {

    }
    @AuraEnabled(cacheable=true)
    public static list<Sessions__c> getSessions(String searchKey){
        List<Sessions__c> sessionResults = new List<Sessions__c>();
        try {
            sessionResults = [SELECT Id, Name, Custom_Location__c, Session_Name__c
                                                    FROM Sessions__c
                                                    WHERE Custom_Location__c = :searchKey];
            if(sessionResults.isEmpty()) {
                throw new AuraHandledException('Sessions not found, try a new location ...');
            }
            return sessionResults;
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error : ' + ex.getMessage());
            return sessionResults;
        }
    }    

}
