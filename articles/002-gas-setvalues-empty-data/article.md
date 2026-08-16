# GASでデータが0件のときにsetValues()でエラーになる場合の対処方法

Google Apps Script（GAS）でスプレッドシートのデータを一括転記するとき、対象データがある場合は正常に動くのに、0件のときだけエラーになることがあります。

原因は、空の二次元配列を `setValues()` に渡そうとしたり、配列の長さ `0` を行数に指定して書き込み範囲を取得しようとしたりすることです。

この記事では、書き込み前にデータ件数を判定し、0件なら安全に処理を終了する方法を解説します。

## 発生する問題

たとえば、条件に合うデータだけを抽出して別シートへ書き込む処理があるとします。

```javascript
const outputData = sourceValues.filter(function (row) {
  return row[2] === '対象';
});

destinationSheet
  .getRange(2, 1, outputData.length, outputData[0].length)
  .setValues(outputData);
```

`outputData` に1件以上のデータがあれば、この処理は書き込み範囲と二次元配列の大きさを合わせられます。

一方、該当データが0件の場合は `outputData` が空配列 `[]` になります。その状態では次の問題が発生します。

- `outputData.length` が `0` になり、書き込み範囲の行数を確保できない
- `outputData[0]` が `undefined` になり、列数を取得できない
- `setValues()` に渡す二次元配列と書き込み範囲を一致させられない

Googleの公式リファレンスでも、`setValues(values)` に渡す二次元配列は、書き込み先Rangeの大きさと一致している必要があると説明されています。

## 対処方法

書き込み範囲を取得する前に、配列の要素数を確認します。データが0件なら `return` で処理を終了します。

```javascript
if (outputData.length === 0) {
  console.log('書き込み対象のデータはありません。');
  return;
}
```

この判定は、`outputData[0].length` を参照する処理や `getRange()`、`setValues()` より前に置くことが重要です。

修正後は次のようになります。

```javascript
const outputData = sourceValues.filter(function (row) {
  return row[2] === '対象';
});

if (outputData.length === 0) {
  console.log('書き込み対象のデータはありません。');
  return;
}

destinationSheet
  .getRange(2, 1, outputData.length, outputData[0].length)
  .setValues(outputData);
```

## 完全版サンプルコード

次のサンプルは、「元データ」シートのA～C列から、C列が「対象」の行だけを「転記先」シートへ追記します。

```javascript
function copyTargetRows() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = spreadsheet.getSheetByName('元データ');
  const destinationSheet = spreadsheet.getSheetByName('転記先');

  if (!sourceSheet || !destinationSheet) {
    throw new Error('「元データ」または「転記先」シートが見つかりません。');
  }

  const lastRow = sourceSheet.getLastRow();

  // 1行目を見出しとして扱うため、データ行がなければ終了する
  if (lastRow < 2) {
    console.log('元データがありません。');
    return;
  }

  const sourceValues = sourceSheet
    .getRange(2, 1, lastRow - 1, 3)
    .getValues();

  const outputData = sourceValues.filter(function (row) {
    return row[2] === '対象';
  });

  // 対象が0件なら、Range取得とsetValues()を実行しない
  if (outputData.length === 0) {
    console.log('転記対象のデータはありません。');
    return;
  }

  const startRow = destinationSheet.getLastRow() + 1;
  const numberOfRows = outputData.length;
  const numberOfColumns = outputData[0].length;

  destinationSheet
    .getRange(startRow, 1, numberOfRows, numberOfColumns)
    .setValues(outputData);

  console.log(numberOfRows + '件のデータを転記しました。');
}
```

### サンプルシートの構成

「元データ」シートには次のようなデータを用意します。

| A列：ID | B列：名称 | C列：状態 |
|---|---|---|
| 1001 | サンプルA | 対象 |
| 1002 | サンプルB | 対象外 |
| 1003 | サンプルC | 対象 |

「転記先」シートには、必要に応じて1行目に同じ見出しを用意してください。

## コードのポイント

### 元データ自体が0件の場合も判定する

このサンプルでは1行目を見出しとして扱っています。`getLastRow()` が1以下ならデータ行がないため、`getRange(2, 1, lastRow - 1, 3)` を実行する前に処理を終了します。

```javascript
if (lastRow < 2) {
  console.log('元データがありません。');
  return;
}
```

つまり、次の2段階で0件を判定しています。

1. 元データの行が0件か
2. 条件に合う転記対象が0件か

### setValues()の配列は二次元配列にする

複数セルへまとめて値を書き込む `setValues()` には、行と列を表す二次元配列を渡します。

```javascript
const values = [
  [1001, 'サンプルA', '対象'],
  [1003, 'サンプルC', '対象']
];
```

書き込み先を2行×3列で取得した場合、渡す配列も2行×3列にします。データが0件の場合だけでなく、行ごとの列数が揃っていない場合もエラーの原因になるため注意してください。

### 0件を正常終了として扱う

転記対象がないこと自体が業務上の異常でなければ、例外を投げるよりも、ログを残して正常終了する方が定期実行に向いています。

一方、必ず1件以上あるはずの処理なら、`return` の代わりに明示的なエラーにする方法もあります。

```javascript
if (outputData.length === 0) {
  throw new Error('転記対象のデータが0件です。抽出条件を確認してください。');
}
```

0件が正常な状態か、調査すべき異常かに応じて使い分けてください。

## まとめ

`setValues()` を使う処理では、書き込み前に配列の件数を確認するのが安全です。

```javascript
if (data.length === 0) {
  return;
}
```

特に、配列の件数を `getRange()` の行数へ指定している場合は、0件の判定をRange取得より前に置きます。あわせて、元データ自体がない場合と、抽出結果だけが0件の場合の両方を確認しておくと、定期実行でも止まりにくい処理になります。

## 参考資料

- [Class Range — Apps Script（Google for Developers）](https://developers.google.com/apps-script/reference/spreadsheet/range)
- [Class Sheet — Apps Script（Google for Developers）](https://developers.google.com/apps-script/reference/spreadsheet/sheet)

