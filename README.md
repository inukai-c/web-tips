# web-tips

実務で得たHTML / CSS / JavaScriptの小技を、公開用に一般化して整理するためのリポジトリです。

## このリポジトリの役割

- GitHub: コード・画像・技術メモの原本管理
- CodePen: 動作サンプルの公開
- note: 解説記事の公開
- Googleスプレッドシート: 記事ID・進捗・各URLの管理

## ディレクトリ構成

```text
web-tips/
├─ README.md
├─ articles/
├─ docs/
│  ├─ index.html
│  └─ images/
└─ templates/
   ├─ article-template.md
   └─ demo/
      ├─ index.html
      ├─ style.css
      └─ script.js
```

## 記事ID・フォルダ名ルール

記事IDは `001`, `002`, `003` のように3桁の連番を使用します。

`articles` 配下のフォルダ名は、記事IDだけではなく、**記事ID＋内容を表す短い英語スラッグ**を必須とします。

```text
{3桁の記事ID}-{英語スラッグ}
```

スラッグは小文字英数字とハイフンを使用し、記事タイトルから内容が判別できる範囲で短くします。

例:

```text
articles/001-countdown-multiple/
articles/002-gas-setvalues-empty-array/
articles/003-intersection-observer-animation/
```

`articles/002/` のように記事IDだけのフォルダは作成しません。

Googleスプレッドシートでは記事IDを3桁の番号で管理し、GitHub URLには上記のフォルダ名を使用します。
画像フォルダが必要な記事は、`docs/images` 配下も記事フォルダと同じ名前に揃えます。

例:

```text
articles/003-intersection-observer-animation/
docs/images/003-intersection-observer-animation/
```

## 公開時の基本ルール

- 会社・顧客固有の画像やコードはそのまま公開しない
- APIキー、トークン、アカウントID、社内URLなどの秘密情報を含めない
- 実案件のクラス名・商品名・画像URLは一般化する
- CodePenに載せるコードは、このリポジトリの内容を原本とする
- 画像は原則として記事専用の公開用素材を使用する

## GitHub Pages

`docs/` をGitHub Pagesの公開元として利用し、CodePenから参照する画像を `docs/images/` に配置します。
