public inherited sharing class LocationsController {
    @AuraEnabled
    public static list<Sessions__c> getLocations(String searchKey){
        List<Sessions__c> locationResults = new List<Sessions__c>();
        try {
            searchKey = '%' + searchKey + '%';
            locationResults = [SELECT Location__c 
                                                    FROM Sessions__c
                                                    WHERE Location__c LIKE :searchKey];
            if(locationResults.isEmpty()) {
                throw new AuraHandledException('Location not found, try a new location ...');
            }
            return locationResults;
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error : ' + ex.getMessage());
            return locationResults;
        }
    }
}
