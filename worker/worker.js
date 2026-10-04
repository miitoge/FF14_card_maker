// Cloudflare Workers（無料枠）用：ロドストの2ページを取得し、文字だけにして返す中継。
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; ff14-card-maker)', 'Accept-Language': 'ja' };
const strip = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '\n')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');

export default {
  async fetch(req, env, ctx) {
    const cors = { 'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*', 'Content-Type': 'application/json; charset=utf-8' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET' } });
    const id = new URL(req.url).searchParams.get('id') || '';
    if (!/^\d{4,12}$/.test(id)) return new Response(JSON.stringify({ error: 'invalid id' }), { status: 400, headers: cors });
    const key = new Request('https://cache.local/' + id), cache = caches.default, hit = await cache.match(key);
    if (hit) return new Response(hit.body, { headers: cors });
    const base = `https://jp.finalfantasyxiv.com/lodestone/character/${id}/`;
    const [p, j] = await Promise.all([fetch(base, { headers: UA }), fetch(base + 'class_job/', { headers: UA })]);
    if (!p.ok || !j.ok) return new Response(JSON.stringify({ error: 'lodestone ' + p.status }), { status: p.status === 404 ? 404 : 502, headers: cors });
    const [ph, jh] = await Promise.all([p.text(), j.text()]);
    const name = ((ph.match(/<title>([^<]+?)\s*\|/) || [])[1] || '').trim();
    const res = new Response(JSON.stringify({ id, name, profile: strip(ph), jobs: strip(jh) }), { headers: { ...cors, 'Cache-Control': 'max-age=600' } });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  }
};
