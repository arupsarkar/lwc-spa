public inherited sharing class LocationsController {
    @AuraEnabled(cacheable=true)
    public static list<Custom_Location__c> getLocations(String searchKey){
        List<Custom_Location__c> locationResults = new List<Custom_Location__c>();
        try {
            searchKey = '%' + searchKey + '%';
            locationResults = [SELECT Id, Location__c 
                                                    FROM Custom_Location__c
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
