/**
 * Runs synchronously in <head> before game scripts.
 * Locale order: parent window __SPARKI_EMBED_LANG__ (set by React host) → ?lang= in iframe URL.
 * Keeping a stable iframe path (no ?lang=) avoids the host treating the embed like a new navigation.
 */
;(function () {
  try {
    var lang = 'en'
    try {
      if (window.parent && window.parent !== window) {
        var pl = window.parent
        if (pl.__SPARKI_EMBED_LANG__ === 'es' || pl.__SPARKI_EMBED_LANG__ === 'en') {
          lang = pl.__SPARKI_EMBED_LANG__
        }
      }
    } catch (e) {}
    var qs = new URLSearchParams(window.location.search)
    if ((qs.get('lang') || '').toLowerCase() === 'es') lang = 'es'
    if ((qs.get('lang') || '').toLowerCase() === 'en') lang = 'en'
    document.documentElement.lang = lang
    window.__SPARKI_MERGE_DEFAULTS__ = null

    if (lang !== 'es') return

    window.__SPARKI_NUMBER_WORDS__ = ['', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']

    var path = window.location.pathname || ''
    var base = path.split('/').pop() || ''
    var id = base.replace(/\.html$/i, '')
    if (!id) return

    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/school-canva-games/i18n/' + encodeURIComponent(id) + '.es.json', false)
    xhr.send()
    if (xhr.status !== 200 || !xhr.responseText) return

    var parsed = JSON.parse(xhr.responseText)
    if (parsed && typeof parsed === 'object') {
      window.__SPARKI_MERGE_DEFAULTS__ = parsed
    }
  } catch (e) {
    window.__SPARKI_MERGE_DEFAULTS__ = null
  }
})()
