/**
 * GOOGLE APPS SCRIPT CODE
 * Copy this code into your Google Apps Script editor (script.google.com).
 * Deploy as a Web App: 
 * - Execute as: Me
 * - Who has access: Anyone
 */

const SHEET_NAME = "Data";

function doGet(e) {
  const action = e.parameter.action;
  const ehrmsCode = e.parameter.ehrmsCode;
  
  if (action === "fetch") {
    return ContentService.createTextOutput(JSON.stringify(fetchEmployeeData(ehrmsCode)))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = saveOrUpdateEmployee(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function fetchEmployeeData(ehrmsCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return { status: "error", message: "Sheet 'Data' not found" };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Column indices (0-based)
  const ehrmsIdx = headers.indexOf("EHRMS CODE");
  const nameIdx = headers.indexOf("EMPLOYEE NAME");
  const desigIdx = headers.indexOf("DESIGNATION");
  const schoolIdx = headers.indexOf("SCHOOL NAME");
  const acctIdx = headers.indexOf("Salary Account Number");
  const ifscIdx = headers.indexOf("IFSC CODE");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][ehrmsIdx].toString() === ehrmsCode.toString()) {
      return {
        status: "success",
        data: {
          ehrmsCode: data[i][ehrmsIdx],
          employeeName: data[i][nameIdx],
          designation: data[i][desigIdx],
          schoolName: data[i][schoolIdx],
          accountNumber: data[i][acctIdx],
          ifscCode: data[i][ifscIdx],
          exists: true,
          isFilled: !!(data[i][acctIdx] && data[i][ifscIdx])
        }
      };
    }
  }
  
  return { status: "not_found", message: "Employee not found" };
}

function saveOrUpdateEmployee(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const ehrmsIdx = headers.indexOf("EHRMS CODE");
  const acctIdx = headers.indexOf("Salary Account Number");
  const ifscIdx = headers.indexOf("IFSC CODE");
  let tsIdx = headers.indexOf("Timestamp");

  // Create Timestamp column if it doesn't exist
  if (tsIdx === -1) {
    tsIdx = headers.length;
    sheet.getRange(1, tsIdx + 1).setValue("Timestamp");
  }
  
  const now = new Date();
  const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  for (let i = 1; i < data.length; i++) {
    if (data[i][ehrmsIdx].toString() === payload.ehrmsCode.toString()) {
      // Found the row, update it
      sheet.getRange(i + 1, acctIdx + 1).setValue(payload.accountNumber);
      sheet.getRange(i + 1, ifscIdx + 1).setValue(payload.ifscCode);
      sheet.getRange(i + 1, tsIdx + 1).setValue(timestamp);
      
      return { status: "success", type: "updated", message: "Data updated successfully" };
    }
  }
  
  return { status: "error", message: "Employee record not found in sheet to update. Please ensure the EHRMS code is valid." };
}
