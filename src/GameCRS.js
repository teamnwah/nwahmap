import {CRS, Projection, transformation} from 'leaflet'

export const GameCRS = Object.assign({}, CRS, {
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
  projection: Projection.LonLat,

  // wrapLng: [-128, 128],
  // wrapLat: [-128, 128],
  transformation: transformation(1, 128, -1, 128),
  infinite: false
});
