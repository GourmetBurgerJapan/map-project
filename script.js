mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyZ2VyaW5mbyIsImEiOiJjbWs2NHJhMmswaTZiM2dvcG5hMTdqeXV5In0.vRs1Sqd1RP2zRR03fmIN4g';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyvSTzAO563nygi8Or3rBYLvUoRs3ZRoU6-hHuGjZvfZuTmCKRicyMck4p-Curctp1k/exec';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [139.7, 35.6],
  zoom: 5
});

let allStores = [];
let markers = [];

const typeColors = {
  "専門店": "red",
  "ダイニング": "blue",
  "カフェ": "green"
};

const prefFilter = document.getElementById('prefFilter');
const typeFilter = document.getElementById('typeFilter');

fetch(GAS_URL)
  .then(res => res.json())
  .then(stores => {
    allStores = stores.filter(s => s.lat && s.lng);

    const prefs = [...new Set(allStores.map(s => s.prefecture))].sort();
    prefs.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p; opt.textContent = p;
      prefFilter.appendChild(opt);
    });

    const types = [...new Set(allStores.map(s => s.shop_type))].sort();
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      typeFilter.appendChild(opt);
    });

    renderMarkers();
  })
  .catch(err => console.error('JSON取得エラー:', err));

prefFilter.addEventListener('change', renderMarkers);
typeFilter.addEventListener('change', renderMarkers);

function renderMarkers() {
  // 既存マーカー削除
  markers.forEach(m => m.remove());
  markers = [];

  // フィルタ適用
  const filtered = allStores.filter(s => {
    const prefOk = prefFilter.value === "" || s.prefecture === prefFilter.value;
    const typeOk = typeFilter.value === "" || s.shop_type === typeFilter.value;
    return prefOk && typeOk;
  });

  // bounds を作成
  const bounds = new mapboxgl.LngLatBounds();

  filtered.forEach(store => {
    const color = typeColors[store.shop_type] || "gray";

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="popup">
        <strong>${store.name}</strong><br>
        <em>${store.editor_comment}</em><br>
        <div>住所: ${store.address}</div>
        <div>営業時間: ${store.opening_hours}</div>
        <div>定休日: ${store.closed_day}</div>
        ${store.official_url ? `<a href="${store.official_url}" target="_blank">公式サイト</a>` : ''}
      </div>
    `);

  const el = document.createElement('img');
  el.src = 'assets/burger.png'; // ← ハンバーガーアイコンのパス
  el.style.width = '30px';      // お好みのサイズ
  el.style.height = '30px';
  el.style.cursor = 'pointer';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([store.lng, store.lat])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);

    // bounds に追加
    bounds.extend([store.lng, store.lat]);
  });

  // マーカーがある場合のみ自動フィット
  if (filtered.length > 0) {
    map.fitBounds(bounds, { padding: 50 });
  }
}

