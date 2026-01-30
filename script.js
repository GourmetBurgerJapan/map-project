mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyZ2VyaW5mbyIsImEiOiJjbWs2NHJhMmswaTZiM2dvcG5hMTdqeXV5In0.vRs1Sqd1RP2zRR03fmIN4g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [139.7, 35.6], // 東京中心
  zoom: 5
});

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyvSTzAO563nygi8Or3rBYLvUoRs3ZRoU6-hHuGjZvfZuTmCKRicyMck4p-Curctp1k/exec';

fetch(GAS_URL)
  .then(res => res.json())
  .then(stores => {
    stores.forEach(store => {
      // 緯度経度が無い場合はスキップ
      if (!store.lat || !store.lng) return;

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

      new mapboxgl.Marker()
        .setLngLat([store.lng, store.lat])
        .setPopup(popup)
        .addTo(map);
    });
  })
  .catch(err => console.error('JSON取得エラー:', err));

