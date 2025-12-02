export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // URL'den dosya adını al

    // Eğer ana sayfaya girildiyse boş dönmesin
    if (!key) return new Response("Dosya adı girilmedi.", { status: 400 });

    // R2 Bucket'tan dosyayı çek (env.BUCKET, ayarlarda verdiğimiz isimdir)
    const object = await env.BUCKET.get(key);

    if (object === null) {
      return new Response('Dosya Bulunamadı (404)', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, {
      headers,
    });
  },
};