import {render} from 'preact'
import PlayerMap from "./components/PlayerMap";

window.addEventListener('load', async () => {
    render(<PlayerMap websocketUrl={`ws://${location.host}/ws/players`}/>, document.body);
});
