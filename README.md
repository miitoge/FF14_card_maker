# FF14 自己紹介カードメーカー（更新版）

公開フォルダは `docs/` です（GitHub Pages：Settings → Pages → Deploy from a branch → main / docs）。

## 更新のしかた
1. このzipの `docs` フォルダの中身のうち **`index.html` `favicon.svg` `ogp.png`** を、リポジトリの `docs/` に上書きコピー
2. 既存の `docs/config.js` はそのまま残す（上書きしない）
3. GitHub Desktop で Commit → Push origin（1〜2分で反映）

## ロドスト取り込み
Cloudflare は不要になりました。標準では公開CORS中継サービス（allorigins / corsproxy.io）経由で取得します。
- 中継サービスは第三者のもので、混雑や停止で失敗することがあります。その場合は「ジョブ」タブの貼り付け方式を使ってください。
- 将来、自前の中継（Cloudflare等）を用意した場合は `docs/config.js` の `LODESTONE_API` にURLを書くと、そちらが優先されます（`worker/worker.js` は引き続き使えます）。

## 追加機能
- 動画（MP4/WebM）・GIF書き出し：ブラウザだけで作成（GIFは外部ライブラリ gifenc を jsDelivr から読み込み）
- 共有リンク：入力内容をURLに入れます（SS画像は含まれません）
- ファビコンとXのリンクカード（ogp.png）
