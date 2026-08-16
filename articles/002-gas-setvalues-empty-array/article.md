# 002 GASでデータが0件のときにsetValues()がエラーになる原因と対処方法

## 概要

Google Apps Script（GAS）で、配列の内容をGoogleスプレッドシートへ `setValues()` で書き込む処理では、対象データが0件のときにエラーになることがあります。

特に、次のようなコードはデータがある間は問題なく動いていても、`values` が空配列 `[]` になると失敗します。

```javascript
sheet
  .getRange(1, 1, values.length, values[0].length)
  .setValues(values);
```

この記事では、なぜ0件時にエラーになるのかと、実務で扱いやすい回避方法を整理します。

## 元になった問題

APIや別シートから取得したデータを配列に格納し、まとめてスプレッドシートへ転記する処理を想定します。

通常時は複数行のデータが取得できるため問題ありませんが、検索条件によって対象データが0件になることがあります。

その状態で通常時と同じ書き込み処理を実行すると、空配列に対して `values[0].length` を参照したり、0行の範囲を作ろうとしたりするため、処理が途中で停止する可能性があります。

## 実現したいこと

- データが1件以上ある場合は、通常どおり `setValues()` で一括書き込みする
- データが0件の場合は、エラーにせず正常終了する
- 0件が異常ではない処理では、後続処理も継続できるようにする
- `values[0]` を参照する前に空配列を判定する

## 原因

Google Apps Scriptの `Range.setValues(values)` は、書き込み対象のRangeと同じ行数・列数を持つ2次元配列を渡す必要があります。

また、次のコードでは `setValues()` の実行前に `values[0].length` を評価します。

```javascript
const values = [];

sheet
  .getRange(1, 1, values.length, values[0].length)
  .setValues(values);
```

`values` が空配列の場合、`values[0]` は `undefined` です。そのため、`.length` を参照できず、JavaScript側でエラーになります。

つまり、「0件のときにsetValues()でエラーになった」と見えていても、実際には `getRange()` の引数を作る段階で失敗している場合があります。

## 対処方法

最もシンプルなのは、`values[0]` を参照する前に `values.length` を確認する方法です。

```javascript
if (values.length === 0) {
  Logger.log('書き込み対象が0件のため終了します。');
  return;
}

sheet
  .getRange(1, 1, values.length, values[0].length)
  .setValues(values);
```

この形なら、0件時には `values[0]` を参照しないため安全です。

## 実装方針

実務では、「0件だった」という状態が正常なのか異常なのかを先に決めておくと扱いやすくなります。

### 0件なら何もせず終了する場合

```javascript
if (values.length === 0) {
  Logger.log('対象データは0件です。');
  return;
}
```

定期実行で「該当データがない日もある」という処理では、この方法が分かりやすいです。

### 0件でも後続処理を続けたい場合

関数全体を終了したくない場合は、書き込み処理だけを条件分岐します。

```javascript
if (values.length > 0) {
  sheet
    .getRange(1, 1, values.length, values[0].length)
    .setValues(values);
}

// 0件でもここから先は実行される
Logger.log('後続処理を実行します。');
```

### 書き込み処理を関数化する場合

同じ判定を複数箇所で使う場合は、関数化すると安全です。

```javascript
function setValuesIfNotEmpty_(sheet, startRow, startColumn, values) {
  if (!Array.isArray(values) || values.length === 0) {
    Logger.log('書き込み対象が0件のため、setValues()を実行しません。');
    return false;
  }

  const columnCount = values[0].length;

  if (columnCount === 0) {
    Logger.log('列数が0件のため、setValues()を実行しません。');
    return false;
  }

  sheet
    .getRange(startRow, startColumn, values.length, columnCount)
    .setValues(values);

  return true;
}
```

使用例です。

```javascript
function sampleWrite() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('出力');

  const values = buildSampleRows_();

  const written = setValuesIfNotEmpty_(sheet, 2, 1, values);

  if (written) {
    Logger.log(`${values.length}件を書き込みました。`);
  } else {
    Logger.log('書き込み対象は0件でした。');
  }
}
```

## 注意点

`values.length > 0` だけでは、2次元配列として正しい形かまでは保証できません。

例えば次の配列は1行ありますが、列数は0です。

```javascript
const values = [[]];
```

また、行ごとの列数が異なる配列も `setValues()` には適しません。

```javascript
const values = [
  ['A', 'B'],
  ['C']
];
```

`setValues()` を使用する場合は、各行の列数を揃えた長方形の2次元配列にします。

## まとめ

0件時のエラーを防ぐポイントは、`setValues()` を呼ぶ直前ではなく、**`values[0]` を参照する前に空配列を判定すること**です。

基本形は次のコードで十分です。

```javascript
if (values.length === 0) {
  return;
}

sheet
  .getRange(1, 1, values.length, values[0].length)
  .setValues(values);
```

API取得や条件抽出では0件が正常に発生することがあります。0件を異常扱いするのではなく、あらかじめ分岐を入れておくことで、定期実行のGASを安定させやすくなります。

## 参照した公式情報

- Google Apps Script `Range.setValues(values)`
  - https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluesvalues
- Google Apps Script `Sheet.getRange(row, column, numRows, numColumns)`
  - https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow,-column,-numrows,-numcolumns

## 動作確認

- [ ] Google Apps Script実環境で、データ1件以上のケースを確認
- [ ] Google Apps Script実環境で、データ0件のケースを確認

人間による実環境での動作確認は未実施です。
