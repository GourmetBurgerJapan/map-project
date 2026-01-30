mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyZ2VyaW5mbyIsImEiOiJjbWs2NHJhMmswaTZiM2dvcG5hMTdqeXV5In0.vRs1Sqd1RP2zRR03fmIN4g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [139.7, 35.6],
  zoom: 5
});

//  GASのURLを入れる
fetch("https://script.google.com/macros/s/AKfycbyvSTzAO563nygi8Or3rBYLvUoRs3ZRoU6-hHuGjZvfZuTmCKRicyMck4p-Curctp1k/exec")
  .then(res => res.json())
  .then(data => {
    data.forEach(place => {
      new mapboxgl.Marker()
        .setLngLat([place.lng, place.lat])
        .setPopup(new mapboxgl.Popup().setText(place.name))
        .addTo(map);
    });
  });
