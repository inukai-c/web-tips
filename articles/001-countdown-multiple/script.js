(function () {
  // デモとして現在時刻から7日後を終了日時に設定します。
  // 固定日時にしたい場合は new Date('2026-12-31T23:59:59+09:00') のように変更してください。
  const targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
