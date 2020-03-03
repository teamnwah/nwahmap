import {Component} from "preact";
import Player from "./Player";

export default class PlayerList extends Component {
    render({players, renderer, map}) {
        return <div className="player-list">
            {players.map(x => <Player key={x.name} player={x} renderer={renderer} map={map}/>)}
        </div>
    }
}