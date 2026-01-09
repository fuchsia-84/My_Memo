'use strict';

{
    const els = {
        text:    document.getElementById('text'),
        save:    document.getElementById('save'),
        clear:   document.getElementById('clear'),
        message: document.getElementById('message'), // role="status" 推奨
        caution: document.getElementById('caution'), // role="status" 推奨
    };

    const MSG = {
        save: {
            success: '保存しました',
            empty:   '値を入力してください！',
            same:    'すでに保存しています',
            confirm: '上書き保存しますか？',
        },
        clear: {
            success: '削除しました',
            empty:   '値が入力されていません！',
            confirm: '本当に削除しますか？'
        }
    };

    // テキストエリアを初期化
    els.text.value = localStorage.getItem('memo') ?? '';
    // if (localStorage.getItem('memo') === null) {
    //     text.value = '';
    // } else {
    //     text.value = localStorage.getItem('memo');
    // }

    // 比較ルール
    function normalize(s) {
        if (s === null) return null; // データ未保存ならnull
        return s.replace(/\r\n?/g, '\n'); // 改行コードの違いを吸収
    }

    // 要素にテキストを設定して表示し、不必要な要素を削除する
    function showMessage(text, showEl, hideEl) {
        // 非表示要素の状態リセット
        hideEl.classList.add('is-hidden');
        hideEl.classList.remove('appear');
        
        // 表示要素を準備
        showEl.textContent = text;
        showEl.classList.remove('is-hidden');

        // 表示した1秒後に消える
        showEl.classList.add('appear');
        setTimeout(() => {
            showEl.classList.remove('appear');
        }, 1000);
    };

    els.save.addEventListener('click', () => {
        const currentRaw = els.text.value;
        const currentTrim = currentRaw.trim();
        const storedRaw = localStorage.getItem('memo');

        // 未入力
        if (currentTrim.length === 0) {
            showMessage(MSG.save.empty, els.caution, els.message);
            return;
        }
        
        // 既存と同一なら同一メッセージを表示
        const same = storedRaw !== null && normalize(storedRaw) === normalize(currentRaw);
        if (same) {
            showMessage(MSG.save.same, els.message, els.caution);
            return;
        }
        // 既存と違ったら上書き確認。既存なしならそのまま保存
        if (storedRaw !== null) {
            if (!confirm(MSG.save.confirm)) {
                return; // キャンセル
            }
        }

        // 保存処理
        try {
            localStorage.setItem('memo', currentRaw);
        } catch (e) {
            // エラー文追加
        }
        showMessage(MSG.save.success, els.message, els.caution);

    });

    clear.addEventListener('click', () => {
        const has = localStorage.getItem('memo');

        if (has === null || has.trim().length === 0) {
            showMessage(MSG.clear.empty, els.caution, els.message);
            return;
        }
        if(confirm(MSG.clear.confirm)) {
            els.text.value = '';
            try { localStorage.removeItem('memo'); } catch {}
            showMessage(MSG.clear.success, els.message, els.caution);
        }
        
    });
}