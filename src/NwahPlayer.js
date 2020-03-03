import {NwahMarker} from "./NwahMarker";
import {colorFromName, normalizeRadians} from "./utils";
import {NwahPlayerTrail} from "./NwahPlayerTrail";

export class NwahPlayer {
    constructor(name) {
        this.x = 0;
        this.y = 0;
        this.isOutside = false;
        this.color = colorFromName(name);
        this.arrow = new NwahMarker([0, 0], {
            color: this.color,
            className: 'nwah-player'
        });
        this.name = name;

        this.trail = new NwahPlayerTrail({color: this.color});
    }

    addTo(nwahMap) {
        this.nwahMap = nwahMap;
        this.map = nwahMap.map;

        if (this.map) {
            this.trail.addTo(nwahMap);
        }
    }

    remove() {
        if (!this.map) {
            return;
        }

        this.map.removeLayer(this.arrow);
        this.trail.remove();
    }

    update(x, y, rot, full = false, isOutside = true, cell = null) {
        if (isOutside !== this.isOutside) {
            if (isOutside) {
                this.map.addLayer(this.arrow);
            } else {
                this.map.removeLayer(this.arrow);
            }

            this.isOutside = isOutside;
        }

        this.trail.push(x, y, isOutside, cell);

        if (!isOutside) {
            return;
        }

        this.x = x;
        this.y = y;
        this.rot = rot;

        if (this.map) {
            this.arrow.setRotation(normalizeRadians(this.rot) + 'rad');
            this.arrow.setLatLng(this.nwahMap.gameCoordsToLatLng(this.x, this.y));
        }
    }
}