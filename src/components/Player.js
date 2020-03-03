import {Component} from "preact";
import Bar from "./Bar";
import {colorFromName} from "../utils";

export default class Player extends Component {
    state = {
        head: null,
        color: null,
    };

    async componentDidMount() {
        let player = this.props.player;
        this.setState({color: colorFromName(player.name)});
        try {
            let render = await this.props.renderer.render([player.head, player.hair]);
            this.setState({head: URL.createObjectURL(render)});
        } catch (e) {
            this.setState({head: null});
        }
    }

    render({player, map}, {head, color}, context) {
        return <div className="player">
            <div className="name" onClick={() => map.show(player.position)}>
                <span className="dot" style={{backgroundColor: color}}/>
                {player.name + " "}
                <span className="level">lvl. {player.level}</span>
            </div>
            {head ?
                <div className="head">
                    <img src={head} alt=""/>
                </div> : null}
            <div className="location">
                {player.isOutside ? null : <><img alt="[Inside]" src="img/house.png"/> <span>{player.cell}</span></>}
            </div>
            <div className="health">
                <Bar current={player.health} base={player.healthBase} type="health"/>
            </div>
            <div className="magicka">
                <Bar current={player.magicka} base={player.magickaBase} type="magicka"/>
            </div>
            <div className="fatigue">
                <Bar current={player.fatigue} base={player.fatigueBase} type="fatigue"/>
            </div>
        </div>
    }
}