/**
 * Runs synchronously in <head> before game scripts. When ?lang=es, loads
 * /school-canva-games/i18n/<basename>.es.json and exposes merges + small hooks.
 */
;(function () {
  try {
    var qs = new URLSearchParams(window.location.search)
    var lang = (qs.get('lang') || '').toLowerCase() === 'es' ? 'es' : 'en'
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
