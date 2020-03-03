import PlayerList from "./PlayerList";
import {Component} from "preact";
import {NwahMap} from "../NwahMap";
import {HeadRenderer} from "../head-render/HeadRenderer";

export default class PlayerMap extends Component {
    state = {
        players: [],
        mapElement: document.createElement('div'),
        renderer: new HeadRenderer(),
        follow: false,
    };

    constructor(props) {
        super();
        this.state.map = new NwahMap(props);
        this.state.mapElement.classList.add('map');
    }

    componentDidMount() {
        this.base.appendChild(this.state.mapElement);
        this.state.map.init(this.state.mapElement, this);
        this.state.renderer.init(200, 200);
    }

    componentDidUpdate() {
        this.state.map.setFollow(this.state.follow);
    }

    render({}, {players, renderer, map, follow}, {}) {
        return <main>
            <div className="head">
                <h2>N'wah map</h2>
                <span>
                    <label>Follow players
                        <input type="checkbox" checked={follow}
                               onChange={(e) => this.setState({follow: e.target.checked})}/>
                    </label>
                </span>
            </div>
            <div className="sidebar">
                <PlayerList players={players} renderer={renderer} map={map}/>
            </div>
        </main>
    }
}