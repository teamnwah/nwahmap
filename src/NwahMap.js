import {CRS, LatLng, LatLngBounds, map, tileLayer} from 'leaflet'
import {NwahIcons} from "./NwahIcons";
import {NwahPlayer} from "./NwahPlayer";
import {Component} from "preact";
import PlayerList from "./components/PlayerList";

export class NwahMap {
    constructor({mapUrl, settings, icons, websocketUrl, playerList} = {}) {

        this.players = {};
        this.mapUrl = mapUrl;
        this.playerList = playerList;
        this.settings = settings || {
            cellSize: 2048,
            cellOffsetY: -20,
            cellOffsetX: 8,
        };
        this.map = null;
        this.follow = false;
        this.icons = icons || NwahIcons;
        this.websocketUrl = websocketUrl;
    }

    setFollow(follow) {
        this.follow = follow;
    }

    init(element, component) {
        this.map = map(element, {
            zoom: 3,
            center: this.gameCoordsToLatLng(0, 0),
            crs: CRS.Simple
        });

        window.nwahMap = this;

        this.map.setMaxBounds(new LatLngBounds(new LatLng(-255, 255), new LatLng(0, 0)));

        this.map.invalidateSize();

        this.tileLayer = tileLayer('/tileset/mwmap/zoom{z}/vvardenfell-{x}-{y}-{z}.jpg', {
            attribution: 'uesp.net',
            minZoom: 0,
            maxZoom: 7,
            zoomOffset: 10,
        });

        this.tileLayer.addTo(this.map);

        if (this.websocketUrl) {
            this.websocket = new WebSocket(this.websocketUrl);
            this.websocket.onmessage = (message) => {
                let event = JSON.parse(message.data);

                if (event.type === "playerPosition") {
                    this.updatePositions(event.positions);
                }

                if (event.type === "fullPlayer") {
                    this.updatePlayers(event.players);
                    component.setState({players: event.players});
                    window.players = event.players;
                }

                if (this.follow) {
                    this.zoomOnPlayers();
                }
            }
        }
    }

    zoomOnPlayers() {
        let locations = Object.values(this.players)
            .filter(x => x.isOutside)
            .map(x => this.gameCoordsToLatLng(x.x, x.y));

        if (locations.length === 0) {
            return;
        }

        let bounds = new LatLngBounds(locations);
        this.map.fitBounds(bounds);
    }

    updatePositions(positions) {
        let knownPlayers = new Set(Object.keys(this.players));
        for (let pos of positions) {
            const name = pos.name;
            knownPlayers.delete(name);
            if (!(name in this.players)) {
                this.players[name] = new NwahPlayer(name);
                this.players[name].addTo(this);
            }

            let [x, y] = pos.position;
            this.players[name].update(x, y, pos.rotation, false, pos.isOutside, pos.cell);
        }

        for (let name of knownPlayers) {
            this.players[name].remove();
            delete this.players[name];
        }
    }

    updatePlayers(players) {
        let knownPlayers = new Set(Object.keys(this.players));
        for (let player of players) {
            const name = player.name;
            knownPlayers.delete(name);
            if (!(name in this.players)) {
                this.players[name] = new NwahPlayer(name);
                this.players[name].addTo(this);
            }

            let {x, y} = player.position;
            this.players[name].update(x, y, player.rotation.z, true, player.isOutside, player.cell);
        }

        for (let name of knownPlayers) {
            this.players[name].remove();
            delete this.players[name];
        }
    }

    gameCoordsToLatLng(x, y) {
        return new LatLng(
            (y / this.settings.cellSize) - 128 + this.settings.cellOffsetY,
            128 + ((x / this.settings.cellSize) + this.settings.cellOffsetX),
        );
    }

    show({x, y}) {
        this.map.panTo(this.gameCoordsToLatLng(x, y));
    }
}