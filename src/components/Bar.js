import {Component} from "preact";

export default class Bar extends Component {
    render({current, base, type}, state, context) {
        const ceilCurrent = Math.ceil(current);
        const perc = (ceilCurrent / base) * 100;
        return <div className={`bar ${type}`}>
            <div className="inner-bar" style={{width: Math.max(perc, 100) + '%'}}>
                <span className="inner-text">{ceilCurrent}/{base} ({Math.ceil(perc)}%)</span>
            </div>
        </div>
    }
}