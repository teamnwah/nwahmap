const SETTINGS = {
  cellSize: 2048,
  cellOffsetY: 20,
  cellOffsetX: 8,
};


const GameCRS = Object.assign({}, L.CRS, {
  scale(zoom) {
    return Math.pow(2, zoom);
  },

  zoom(scale) {
    return Math.log(scale) / Math.LN2;
  },

  distance(latlng1, latlng2) {
    let dx = latlng2.lng - latlng1.lng,
      dy = latlng2.lat - latlng1.lat;

    return Math.sqrt(dx * dx + dy * dy);
  },
  projection: L.Projection.LonLat,

  wrapLng: [-128, 128],
  wrapLat: [-128, 128],
  transformation: L.transformation(1, 128, 1, 128),
  infinite: false
});

const map = document.querySelector('.map');
const lMap = L.map(map, {
  zoom: 0,
  center: [0, 0],
  crs: GameCRS
});

L.tileLayer('/tileset/mwmap/zoom{z}/vvardenfell-{x}-{y}-{z}.jpg', {
  attribution: 'uesp.net',
  minZoom: 0,
  maxZoom: 7,
  zoomOffset: 10,
}).addTo(lMap);

document.addEventListener('DOMContentLoaded', () => lMap.invalidateSize());
document.addEventListener('resize', () => lMap.invalidateSize());

setMarkers();

async function setMarkers() {
  let markers = await fetch('http://yoko/tes3mp/assets/json/LiveMap.json');

  for (let [name, details] of Object.entries(await markers.json())) {
    L.marker(translateLocationGameToMap(details.x, details.y)).addTo(lMap)
  }
}

function translateLocationGameToMap(x, y) {
  const trans = [
    (-y / SETTINGS.cellSize) + SETTINGS.cellOffsetY,
    (x / SETTINGS.cellSize) + SETTINGS.cellOffsetX,
  ];

  console.log(trans);
  return trans;
}

class NwahMap {
  constructor(settings) {
    this.markers = {};
    this.settings = settings;
  }

  init(map) {

  }

  translateGameLocToLatLng(x, y) {
    return L.LatLng
  }
}