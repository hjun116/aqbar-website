/**
 * AQbar 문의 폼 → Google 스프레드시트 연동
 *
 * 설정 방법:
 * 1. Google 스프레드시트를 새로 만듭니다.
 * 2. 첫 번째 시트 이름을 "문의"로 바꿉니다.
 * 3. 1행에 아래 헤더를 입력합니다:
 *    접수일시 | 문의 유형 | 담당자 이름 | 회사 이메일 | 회사명 | 접속 환경
 * 4. 확장 프로그램 → Apps Script 를 열고 이 파일 내용을 붙여넣습니다.
 * 5. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자
 * 6. 배포 후 나온 웹 앱 URL을 contact-config.js 의 webAppUrl 에 넣습니다.
 */

var SHEET_NAME = '문의';

function doPost(e) {
  try {
    var sheet = getOrCreateSheet_();
    var data = JSON.parse(e.postData.contents);
    var inquiryType = data.inquiryType === 'pricing' ? '가격 문의' : 'PoC 신청';

    sheet.appendRow([
      new Date(),
      inquiryType,
      data.name || '',
      data.email || '',
      data.company || '',
      data.source === 'mobile' ? '모바일' : '데스크톱'
    ]);

    return jsonResponse_({ status: 'success' });
  } catch (error) {
    return jsonResponse_({ status: 'error', message: String(error) });
  }
}

function doGet() {
  return jsonResponse_({ status: 'ok' });
}

function getOrCreateSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['접수일시', '문의 유형', '담당자 이름', '회사 이메일', '회사명', '접속 환경']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
