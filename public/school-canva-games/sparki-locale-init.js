/**
 * Runs synchronously in <head> before game scripts.
 * Locale order: walk same-origin parent chain for __SPARKI_EMBED_LANG__ (React host) → ?lang= in iframe URL.
 * i18n JSON is loaded relative to this document so it works with a Vite base path or nested deploys.
 * Keeping a stable iframe path (no ?lang=) avoids the host treating the embed like a new navigation.
 */
;(function () {
  function getHostEmbedLang() {
    var w = window
    var seen = {}
    for (var i = 0; i < 12; i++) {
      try {
        var next = w.parent
        if (!next || next === w) break
        w = next
        if (seen[w]) break
        seen[w] = true
        var l = w.__SPARKI_EMBED_LANG__
        if (l === 'es' || l === 'en') return l
      } catch (e) {
        break
      }
    }
    return null
  }

  try {
    var lang = 'en'
    var hostLang = getHostEmbedLang()
    if (hostLang === 'es' || hostLang === 'en') lang = hostLang
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
    var i18nUrl = new URL('i18n/' + encodeURIComponent(id) + '.es.json', window.location.href).href
    xhr.open('GET', i18nUrl, false)
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
