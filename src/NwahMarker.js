import {Marker} from "leaflet";
import {divIcon} from "leaflet/dist/leaflet-src.esm";

export const NwahMarker = Marker.extend({
    options: {
        rotation: '0deg',
        color: '#fff',
        icon: divIcon({
            className: 'nwah-player-marker',
            iconSize: [0, 0],
            iconAnchor: [5, 10],
        })
    },

    setRotation(deg) {
        this.options.rotation = deg;
    },

    _initIcon() {
        Marker.prototype._initIcon.call(this);
        this._icon.style.borderBottomColor = this.options.color || '#fff';
    },

    _setPos(pos) {
        Marker.prototype._setPos.call(this, pos);
        if (this.options.icon && this.options.icon.options && this.options.icon.options.iconAnchor) {
            let iconAnchor = this.options.icon.options.iconAnchor;
            this._icon.style.transformOrigin = `${iconAnchor[0]}px ${iconAnchor[1]}px`;
        } else {
            this._icon.style.transformOrigin = 'center bottom';
        }
        this._icon.style.transform += ` rotateZ(${this.options.rotation})`
    }
});