import fetch from 'node-fetch';

async function testBing(query) {
  const url = `https://www.bing.com/images/async?q=${encodeURIComponent(query)}&async=content&first=0&count=35`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  const text = await res.text();
  const matches = [...text.matchAll(/class="iusc"[^>]*?m="([^"]+)"/g)];
  console.log('Bing status:', res.status, 'matches:', matches.length);
}

testBing('ISKCON Temple Noida');
  