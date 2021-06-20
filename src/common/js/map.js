// export default function MapLoader(key) {
//     return new Promise((resolve, reject) => {
//         if (window.AMap) {
//             resolve(window.AMap)
//         } else {
//             var script = document.createElement('script')
//             script.type = "text/javascript"
//             script.async = "true"
//             script.src = "http://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key='" + key
//             script.onerror = reject
//             document.head.appendChild(script)
//         }
//         window.initAMap = () => { resolve(window.AMap) }
//     })
// }