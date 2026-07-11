// Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver).
// Run AFTER deploying, so the key file and URLs are live:
//   node scripts/submit-indexnow.mjs
const SITE = "https://linuxacademy.ir";
const KEY = "4a0f117bb3f243fc693a9d891442217a";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error("No URLs found in sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "linuxacademy.ir",
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }),
});

console.log(`Submitted ${urls.length} URLs to IndexNow -> HTTP ${res.status}`);
if (!res.ok) console.log(await res.text());
