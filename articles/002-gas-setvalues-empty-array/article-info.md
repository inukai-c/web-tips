# 記事情報

- 記事ID: 002
- フォルダ名: `002-gas-setvalues-empty-array`
- 記事タイトル: GASでデータが0件のときにsetValues()がエラーになる原因と対処方法
- 記事概要: Google Apps Scriptで配列をスプレッドシートへ一括書き込みする際、対象データが0件だと `values[0].length` の参照やRange生成で処理が失敗する問題を取り上げ、空配列を事前判定して安全に `setValues()` を実行する方法を解説します。
- カテゴリ: Google Apps Script
- タグ候補:
  - GAS
  - Google Apps Script
  - Googleスプレッドシート
  - setValues
  - 空配列
  - エラー対処
  - データ転記
- CodePen: 不要
- 実環境動作確認: 未実施

## 命名ルール

記事フォルダは次の形式とします。

```text
{3桁の記事ID}-{内容を表す短い英語スラッグ}
```

例:

```text
001-countdown-multiple
002-gas-setvalues-empty-array
```

スラッグは小文字英数字とハイフンを使用し、記事内容が判別できる範囲で短くします。

## 参照した公式情報

- Google Apps Script `Range.setValues(values)`
  - https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluesvalues
- Google Apps Script `Sheet.getRange(row, column, numRows, numColumns)`
  - https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow,-column,-numrows,-numcolumns
