/**
 * Associate redmine hyperlink to redmine issues starting with pattern: #([1-9][0-9]{3}
 * Refer: https://developers.google.com/apps-script/service_spreadsheet
 */
 
// Note: replace with actual redmine URL.
var BASE_REDMINE_URL = "http://redmine.org/issues/"

function addRedmineHyperLink() {
  var sheet = SpreadsheetApp.getActiveSheet();  
  var lastRow = sheet.getLastRow();
  var range = sheet.getDataRange();
  var regExp = new RegExp('^#([1-9][0-9]{3}) ');
  
  for (var i = 0; i <= lastRow - 1; i++) {
    var cell = range.getCell(i + 1, 1);
    var cellValue = cell.getValue();
    var match = cellValue.match(regExp);
    if (match) {
        var issueId = match[1];
        cellValue = cellValue.replace(/"/g, '""');
        var hyperlink = '=HYPERLINK("' + BASE_REDMINE_URL + issueId + '","' + cellValue +'")';
        cell.setValue(hyperlink);
    }
  }
}

/**
 * Remove redmine hyperlink from redmine issues
 */
function removeRedmineHyperLink() {
  var sheet = SpreadsheetApp.getActiveSheet();  
  var lastRow = sheet.getLastRow();
  var range = sheet.getDataRange();
  var regExp = new RegExp('^#([1-9][0-9]{3}) ');
  
  for (var i = 0; i <= lastRow - 1; i++) {
    var cell = range.getCell(i + 1, 1);
    var cellValue = cell.getValue();
    var match = cellValue.match(regExp);
    if (match) {
        cell.setValue(cellValue);
    }
  }
}

/**
 * Adds a custom menu to the active spreadsheet.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Add Redmine Hyperlink",
    functionName : "addRedmineHyperLink"
  },
  {
    name : "Remove Redmine Hyperlink",
    functionName : "removeRedmineHyperLink"
  }];
  
  spreadsheet.addMenu("Script Center Menu", entries);
// spreadsheet.removeMenu("Script Center Menu");
};
