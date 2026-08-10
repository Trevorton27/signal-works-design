/**
 * Japanese test script for the /services consultation form.
 *
 * Usage:
 *   1. Open http://localhost:3000/services in your browser
 *   2. Switch language to Japanese (click the language toggle)
 *   3. Scroll to the consultation form
 *   4. Open DevTools console (F12 -> Console)
 *   5. Paste this entire script and press Enter
 *   6. Watch it fill each step and auto-advance
 */

(async () => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- helpers -----------------------------------------------------------

  function clickLabel(text) {
    const labels = [...document.querySelectorAll('label')];
    const match = labels.find((l) => l.textContent.trim().includes(text));
    if (match) {
      match.click();
    } else {
      console.warn(`[test] label not found: "${text}"`);
    }
  }

  function setInput(el, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setSelect(el, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value'
    ).set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function getInputs() {
    return [...document.querySelectorAll('#consultation-form input, #consultation-form textarea, #consultation-form select')];
  }

  function clickNext() {
    const btns = [...document.querySelectorAll('#consultation-form button')];
    const next = btns.find(
      (b) => b.textContent.includes('次へ') || b.textContent.includes('送信')
    );
    if (next && !next.disabled) next.click();
  }

  // --- Step 1: あなたについて ---------------------------------------------
  console.log('[test] ステップ 1: あなたについて');
  const inputs1 = getInputs();
  setInput(inputs1[0], '田中 美咲');                     // 氏名
  setInput(inputs1[1], '株式会社サクラテック');              // 会社名
  setInput(inputs1[2], '事業開発部長');                    // 役職
  setInput(inputs1[3], 'tanaka@sakuratech.example.co.jp'); // メール
  setInput(inputs1[4], '080-9876-5432');                  // 電話番号
  clickLabel('Zoom');                                     // 連絡方法
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 2: 何を作りたいですか？ ----------------------------------------
  console.log('[test] ステップ 2: プロジェクトの内容');
  clickLabel('社内業務ツール');
  await delay(200);
  const inputs2 = getInputs();
  const ta2 = inputs2.filter((el) => el.tagName === 'TEXTAREA');
  setInput(ta2[0],
    '社内の受注管理と在庫管理を一元化するWebアプリケーションを開発したいです。現在はExcelとメールで管理しており、入力ミスや情報の遅延が頻繁に発生しています。営業チームが外出先からもスマートフォンで在庫確認・受注登録できるモバイル対応のシステムを希望します。'
  );
  setInput(ta2[1],
    '手作業による受注処理に毎日2時間以上かかっている。在庫情報がリアルタイムで把握できず、欠品や過剰在庫が発生。営業担当が事務所に戻らないと受注状況を確認できない。月末の集計レポート作成に丸1日かかっている。'
  );
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 3: プロジェクトの詳細 ------------------------------------------
  console.log('[test] ステップ 3: プロジェクトの詳細');
  clickLabel('既存プロジェクトの改善');
  await delay(200);
  clickLabel('ウェブサイト');
  clickLabel('データベース');
  clickLabel('ドキュメント');
  await delay(200);
  const inputs3 = getInputs();
  const ta3 = inputs3.filter((el) => el.tagName === 'TEXTAREA');
  if (ta3.length > 0) {
    setInput(ta3[0],
      '現在のシステム: https://internal.sakuratech.example.co.jp\n古いPHPベースの在庫管理画面があります。\nMySQLデータベースに約50,000件の商品データがあります。\n社内wikiにAPI仕様書があります。'
    );
  }
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 4: 機能 -------------------------------------------------------
  console.log('[test] ステップ 4: 機能');
  clickLabel('ユーザーアカウント');
  clickLabel('ログイン');
  clickLabel('管理ダッシュボード');
  clickLabel('レポート');
  clickLabel('メール通知');
  clickLabel('ファイルアップロード');
  clickLabel('在庫管理');
  clickLabel('アナリティクス');
  clickLabel('カスタムデータベース');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 5: AI機能 -----------------------------------------------------
  console.log('[test] ステップ 5: AI機能');
  clickLabel('たぶん');
  await delay(300);
  clickLabel('ドキュメント要約');
  clickLabel('レポート生成');
  clickLabel('社内ナレッジ検索');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 6: スケジュール ------------------------------------------------
  console.log('[test] ステップ 6: スケジュール');
  clickLabel('2〜3ヶ月');
  await delay(200);
  const dateInput = getInputs().find((el) => el.type === 'date');
  if (dateInput) setInput(dateInput, '2026-12-01');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 7: ご予算 -----------------------------------------------------
  console.log('[test] ステップ 7: ご予算');
  clickLabel('¥500k');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 8: 成功の定義 --------------------------------------------------
  console.log('[test] ステップ 8: 成功の定義');
  const inputs8 = getInputs();
  const ta8 = inputs8.filter((el) => el.tagName === 'TEXTAREA');
  if (ta8.length > 0) {
    setInput(ta8[0],
      'リリースから6ヶ月後の成功の姿：\n1. 受注処理時間が1日2時間から30分に短縮\n2. 在庫データがリアルタイムで全社員に共有され、欠品率が50%減少\n3. 営業チームが外出先からスマホで受注・在庫確認が可能\n4. 月末レポートが自動生成され、集計作業が不要に\n5. 入力ミスによるクレームがゼロに近づく'
    );
  }
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 9: 相談について ------------------------------------------------
  console.log('[test] ステップ 9: 相談について');
  clickLabel('60分');
  await delay(200);
  clickLabel('平日午後');
  clickLabel('平日夜');
  await delay(200);
  const selects = getInputs().filter((el) => el.tagName === 'SELECT');
  if (selects.length > 0) setSelect(selects[0], 'Asia/Tokyo (JST)');
  await delay(300);
  clickNext();
  await delay(500);

  // --- Step 10: その他 -----------------------------------------------------
  console.log('[test] ステップ 10: その他');
  const inputs10 = getInputs();
  const ta10 = inputs10.filter((el) => el.tagName === 'TEXTAREA');
  if (ta10.length > 0) {
    setInput(ta10[0],
      '弊社は大阪市中央区にオフィスがあります。対面でのミーティングも可能です。既存システムのPHPコードは社内エンジニアが保守していますが、新システムへのデータ移行についてもご相談したいです。セキュリティ要件として、社内ネットワークからのみアクセス可能にする必要があります。'
    );
  }
  await delay(300);

  console.log('[test] 全ステップ入力完了。「送信する」をクリックして送信するか、「戻る」で各ステップを確認してください。');
  // 自動送信するにはコメントを外してください:
  // clickNext();
})();
