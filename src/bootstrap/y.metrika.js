const scriptTag = document.getElementById('ya-metrika-init')
const counterId = Number(scriptTag?.dataset?.counterId || null)

export default function () {
    if (counterId) {
        /* eslint-disable */
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }
            m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym")

        const id = window.ymCounter = counterId

        window.ym(id, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        })
        /* eslint-enable */
    }
}
