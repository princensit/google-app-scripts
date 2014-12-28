/**
* This Google Apps Script is used to send SMS for important emails under {@value #LABEL_NAME} label.
* Note: Setup mobile no. from https://www.google.com/calendar/render?tab=wc#m
*
* @author      Prince Raj
* @version     1.0
* @since       2014-12-28
*/

// Gmail label for which SMS is sent.
var LABEL_NAME = "SMS Mail"

// Constant, don't modify this
var ONE_MINUTE = 60000

function main() {
    // Clears the previous log
    Logger.clear();

    // Get Calendar
    var cal = getCalendar_();
    
    // Delete older events, if any
    deleteOlderEvents_(cal);
    
    // Send SMS for important emails
    smsMail_(cal);
}

function smsMail_(cal) {
    try {
        var now = new Date().getTime();
        var label = GmailApp.getUserLabelByName(LABEL_NAME);
        var threads = label.getThreads();
        for (i in threads) {
            var messages = threads[i].getMessages();
            var lastIndex = messages.length - 1;
            var subject = threads[i].getFirstMessageSubject();
            var from = messages[lastIndex].getFrom();
            var body = messages[lastIndex].getPlainBody();
            body = body.split("\n")[0];

            // Note: SMS has limit on # of characters, so complete title may not be seen in SMS you received
            var title = subject + " :: " + body;
            cal.createEvent(title, new Date(now + ONE_MINUTE), new Date(now + ONE_MINUTE)).removeAllReminders().addSmsReminder(0);
        }

        label.removeFromThreads(threads);
    } catch (err) {
        Logger.log("Error occurred: " + err.toString());
    }
}

function getCalendar_() {
    try {
        var cal = CalendarApp.getCalendarsByName(LABEL_NAME)[0];
        if (!cal) {
            cal = CalendarApp.createCalendar(LABEL_NAME, {
                summary: 'A calendar to send SMS for important emails',
                color: CalendarApp.Color.TURQOISE,
                timeZone: 'Asia/Kolkata'
            });
            Logger.log('Created the calendar "%s", with the ID "%s".', cal.getName(), cal.getId());
        }
        return cal;
    } catch (e) {
        Logger.log("Error Occured" + e.toString());
    }
}


function deleteOlderEvents_(cal) {
    var now = new Date().getTime();
    var events = cal.getEvents(new Date('January 1, 2014 IST'), new Date(now - 2 * ONE_MINUTE));
    for (i in events) {
        events[i].deleteEvent();
    }
}
