import {polyline, marker} from "leaflet";
import {NwahEntryMarker} from "./NwahEntryMarker";

export class NwahPlayerTrail {
    constructor({color = '#fff'} = {color: '#fff'}) {
        this.nwahMap = null;
        this.color = color;
        this.currentLine = null;
        this.items = [];
        this.lastEntry = null;
        this.isOutside = false;
        this.lastPosition = null;
        this.map = null;
        this.expirationTime = 10 /* min */ * 60 * 1000;
    }

    addTo(nwahMap) {
        this.nwahMap = nwahMap;
        this.map = nwahMap.map;
        this.items.forEach(line => line.item.addTo(map));
    }

    push(x, y, isOutside, cell) {
        if (this.isOutside !== isOutside) {
            if (this.isOutside) {
                this.lastEntry = new NwahEntryMarker(this.nwahMap.gameCoordsToLatLng(this.lastPosition.x, this.lastPosition.y), {color: this.color});
                if (this.map) {
                    this.lastEntry.addTo(this.map);
                }

                this.lastEntry.mark();
                this.items.push({
                    type: 'entry',
                    item: this.lastEntry,
                    locations: [{time: performance.now()}],
                    marked: true,
                });
            } else {
                if (this.lastEntry !== null) {
                    this.lastEntry.marked = false;
                    this.lastEntry.unmark();
                }
            }
        }

        this.isOutside = isOutside;

        if (!isOutside) {
            this.currentLine = null;
            this.cull();
            return;
        }

        if (this.lastPosition !== null) {
            let xDist = (this.lastPosition.x - x);
            let yDist = (this.lastPosition.y - y);

            if (Math.sqrt((xDist * xDist) + (yDist * yDist)) > this.nwahMap.settings.cellSize) {
                let teleportLine = polyline([this.nwahMap.gameCoordsToLatLng(this.lastPosition.x, this.lastPosition.y), this.nwahMap.gameCoordsToLatLng(x, y)], {
                    color: this.color,
                    opacity: 0.2,
                });
                teleportLine.addTo(this.map);
                this.items.push({
                    type: 'teleport',
                    item: teleportLine,
                    locations: [{time: performance.now()}],
                });

                if (this.currentLine) {
                    this.currentLine = null;
                }
            }
        }

        if (this.currentLine === null) {
            this.currentLine = polyline([], {
                dashArray: '4',
                color: this.color,
            });

            this.items.push(this.lastItem = {type: 'path', item: this.currentLine, locations: []});

            if (this.map) {
                this.currentLine.addTo(this.map);
            }
        }

        this.lastPosition = {x, y};
        let latLng = this.nwahMap.gameCoordsToLatLng(x, y);
        this.lastItem.locations.push({time: performance.now(), location: latLng});
        this.lastItem.item.addLatLng(latLng);
        this.cull();
    }

    remove() {
        let items = this.items;
        this.items = [];
        items.forEach(x => this.map.removeLayer(x.item));
    }

    cull() {
        let i = 0;
        let goodAfter = performance.now() - this.expirationTime;
        for (; i < this.items.length; i++) {
            let item = this.items[i];
            let okLocs = [];
            for (let j = 0; j < item.locations.length; j++) {
                if (item.locations[j].time < goodAfter) {
                    continue;
                }

                okLocs.push(item.locations[j]);
            }

            if (okLocs.length === 0) {
                if (item.marked) {
                    break;
                }

                this.map.removeLayer(item.item);
                continue;
            }

            item.locations = okLocs;

            if (item.type === 'path') {
                item.item.setLatLngs(item.locations.map(x => x.location));
            }

            break;
        }

        this.items = this.items.slice(i);
    }
}