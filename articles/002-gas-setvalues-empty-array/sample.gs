function sampleWrite() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('出力');

  if (!sheet) {
    throw new Error('出力シートが見つかりません。');
  }

  const values = buildSampleRows_();

  const written = setValuesIfNotEmpty_(sheet, 2, 1, values);

  if (written) {
    Logger.log(`${values.length}件を書き込みました。`);
  } else {
    Logger.log('書き込み対象は0件でした。');
  }
}

/**
 * 書き込み対象がある場合だけ setValues() を実行します。
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 書き込み先シート
 * @param {number} startRow 書き込み開始行
 * @param {number} startColumn 書き込み開始列
 * @param {Array<Array<*>>} values 書き込む2次元配列
 * @return {boolean} 書き込みを実行した場合 true
 */
function setValuesIfNotEmpty_(sheet, startRow, startColumn, values) {
  if (!Array.isArray(values) || values.length === 0) {
    Logger.log('書き込み対象が0件のため、setValues()を実行しません。');
    return false;
  }

  if (!Array.isArray(values[0]) || values[0].length === 0) {
    Logger.log('列数が0件のため、setValues()を実行しません。');
    return false;
  }

  const columnCount = values[0].length;

  const hasDifferentColumnCount = values.some(function(row) {
    return !Array.isArray(row) || row.length !== columnCount;
  });

  if (hasDifferentColumnCount) {
    throw new Error('values の各行の列数が一致していません。');
  }

  sheet
    .getRange(startRow, startColumn, values.length, columnCount)
    .setValues(values);

  return true;
}

/**
 * サンプル用データを作成します。
 * 0件を試す場合は return []; に変更してください。
 *
 * @return {Array<Array<*>>}
 */
function buildSampleRows_() {
  return [
    ['2026-08-17', 'sample-001', 10],
    ['2026-08-17', 'sample-002', 20]
  ];
}
