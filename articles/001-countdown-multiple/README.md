# 001 - 複数箇所に同じカウントダウンタイマーを表示

## 概要

同じページ内にある複数のカウントダウン表示を、1つのJavaScript処理で同時に更新するサンプルです。

## CodePen用ファイル

- `index.html` : HTML欄へ貼り付け
- `style.css` : CSS欄へ貼り付け
- `script.js` : JS欄へ貼り付け

## 記事原稿

- `article.md` : note / WordPress用の記事原本

## 実装のポイント

`id`ではなく共通クラスを使い、`document.querySelectorAll()`ですべての表示要素を取得して更新します。

## デモの終了日時

`script.js` はCodePenで開いたときに必ず動作を確認できるよう、現在時刻から7日後を終了日時として設定しています。

固定日時にする場合は次のように変更してください。

```javascript
const targetDate = new Date('2026-12-31T23:59:59+09:00');
```

## 公開前チェック

- 実案件の商品名・会社名を含んでいないこと
- 実案件の画像URL・社内URLを含んでいないこと
- APIキーやトークンを含んでいないこと
- Chrome / Firefox / Edgeで動作確認すること
- スマートフォン幅でレイアウト確認すること
