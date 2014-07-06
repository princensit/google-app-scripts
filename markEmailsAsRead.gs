// Ref: http://www.johneday.com/422/time-based-gmail-filters-with-google-apps-script

// Date before which all unread mails need to be marked as read
var BEFORE_DATE="2014/06/16";

function markAsRead() {
    var threads = GmailApp.search('is:unread before:' + BEFORE_DATE);
    Logger.log("# of threads: " + threads.length);
    
    var batchSize = 100 // Process up to 100 threads at once
    for (j = 0; j < threads.length; j += batchSize) {
        GmailApp.markThreadsRead(threads.slice(j, j + batchSize));
    }
}
