# FF14 自己紹介カードメーカー

完全無料で公開できる構成です（GitHub Pages ＋ Cloudflare Workers 無料枠）。Node.js やコマンド操作は不要です。

```
ff14-card-maker/
├─ site/                  ← 公開されるサイト本体
│  ├─ index.html          （カードメーカー）
│  └─ config.js           （ロドスト用サーバーのURLをここに書く）
├─ worker/
│  ├─ worker.js           （ロドスト取得用の中継。Cloudflareに貼る）
│  └─ wrangler.toml       （CLIで使う場合のみ）
└─ .github/workflows/pages.yml  （push で自動公開）
```

## 手順1：GitHub Desktop で公開する
1. GitHub Desktop → **File → New repository…**（Name: `ff14-card-maker`、Local path は好きな場所）→ **Create repository**
2. このフォルダの中身（`site` `worker` `.github` `README.md` `.gitignore`）を、作られたフォルダへそのままコピー
3. GitHub Desktop に変更が出るので、左下に「first commit」と書いて **Commit to main** → 上部の **Publish repository**
   （**「Keep this code private」のチェックは外す**。無料プランの Pages は公開リポジトリのみ）
4. GitHub のサイトでリポジトリを開く → **Settings → Pages → Build and deployment → Source を「GitHub Actions」** にする
5. **Actions** タブで `Deploy to GitHub Pages` が緑になれば完了。URLは `https://（ユーザー名）.github.io/ff14-card-maker/`

## 手順2：ロドスト自動取り込みを有効にする（Cloudflare・無料）
1. https://dash.cloudflare.com でアカウント作成 → **Workers & Pages → Create → Create Worker**（名前は `ff14-lodestone` など）→ **Deploy**
2. **Edit code** を開き、中身を `worker/worker.js` の内容で丸ごと置き換えて **Deploy**
3. 表示された URL（`https://ff14-lodestone.○○.workers.dev`）をコピー
4. `site/config.js` を開き `const LODESTONE_API = "（そのURL）";` に書き換え
5. GitHub Desktop で Commit → Push origin。1分ほどで反映されます

使い方：カードメーカーの「基本」タブ上部にロドストのURL（またはID）を入れて「取り込む」。

## うまくいかない時
- 取り込みが失敗する：キャラクターがロドストで非公開、IDの間違い、またはロドスト側がCloudflareからのアクセスを制限している可能性があります。その場合は「ジョブ」タブの**貼り付け方式**（クラス・ジョブページを全選択→コピー→貼り付け）が使えます。
- Worker は無料枠で1日10万リクエストまで。同じキャラは10分間キャッシュされます。

## 権利について
- スクリーンショットとゲーム内の素材の著作権は株式会社スクウェア・エニックスにあります。公式ジョブアイコンを同梱する前に、必ず [公式のライセンス](https://jp.finalfantasyxiv.com/license/) と素材利用のルールを確認してください。確認できたら `site/assets/icons/` に置き、読み込む実装を足します。
- 現在のジョブアイコンはこのプロジェクト用に描いたオリジナルです。

## 今後の候補
動くカードの動画/GIF書き出し、共有URL、公式アイコンの同梱（ライセンス確認後）。
