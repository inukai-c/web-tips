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

## 記事IDルール

記事は `001-...`, `002-...` のように3桁の連番を付けます。
Googleスプレッドシート上の記事ID、`articles` 配下のフォルダ名、`docs/images` 配下の画像フォルダ名を揃えます。

例:

```text
articles/002-intersection-observer-animation/
docs/images/002-intersection-observer-animation/
```

## 公開時の基本ルール

- 会社・顧客固有の画像やコードはそのまま公開しない
- APIキー、トークン、アカウントID、社内URLなどの秘密情報を含めない
- 実案件のクラス名・商品名・画像URLは一般化する
- CodePenに載せるコードは、このリポジトリの内容を原本とする
- 画像は原則として記事専用の公開用素材を使用する

## GitHub Pages

`docs/` をGitHub Pagesの公開元として利用し、CodePenから参照する画像を `docs/images/` に配置します。
