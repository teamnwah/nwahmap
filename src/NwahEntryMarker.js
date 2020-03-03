import {Marker} from "leaflet";
import {divIcon} from "leaflet/dist/leaflet-src.esm";

export const NwahEntryMarker = Marker.extend({
    options: {
        color: '#fff',
        icon: divIcon({
            className: 'nwah-entry-marker',
            iconSize: ['', '']
        })
    },

    _initIcon() {
        Marker.prototype._initIcon.call(this);
        this._icon.src = "";
        this._icon.style.backgroundColor = this.options.color;
    },

    mark() {
        this._icon.classList.add('mark');
    },

    unmark() {
        this._icon.classList.remove('mark');
    },
});