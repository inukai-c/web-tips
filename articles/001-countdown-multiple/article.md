# JavaScriptで同じカウントダウンタイマーを複数箇所に表示する方法

同じページ内にカウントダウンタイマーを2か所以上表示したいとき、要素をIDで指定していると、最初の1か所しか更新されないことがあります。

この記事では、同じ残り時間を複数の表示エリアへ反映する方法を紹介します。

## 実現したいこと

たとえば、ページ上部と下部の2か所に同じカウントダウンを表示します。

```html
<div class="countdown">
  <span class="js-days">00</span>:
  <span class="js-hours">00</span>:
  <span class="js-minutes">00</span>:
  <span class="js-seconds">00</span>
</div>

<div class="countdown">
  <span class="js-days">00</span>:
  <span class="js-hours">00</span>:
  <span class="js-minutes">00</span>:
  <span class="js-seconds">00</span>
</div>
```

## ポイント

`getElementById()` は基本的に1つの要素を対象にします。複数箇所を同時に更新したい場合は、共通クラスを付けて `querySelectorAll()` でまとめて取得します。

```javascript
document.querySelectorAll('.js-seconds').forEach(function (el) {
  el.textContent = seconds;
});
```

この考え方を日・時・分・秒それぞれに適用します。

## JavaScript

```javascript
(function () {
  const targetDate = new Date('2026-12-31T23:59:59+09:00');

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff < 0) {
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const values = {
      '.js-days': String(days).padStart(2, '0'),
      '.js-hours': String(hours).padStart(2, '0'),
      '.js-minutes': String(minutes).padStart(2, '0'),
      '.js-seconds': String(seconds).padStart(2, '0')
    };

    Object.keys(values).forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.textContent = values[selector];
      });
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
```

## まとめ

同じ値を複数箇所に表示したい場合は、IDではなく共通クラスを使い、`querySelectorAll()` で対象要素をまとめて更新すると扱いやすくなります。

CodePenの動作サンプルは、公開後にこの記事へ追加します。
