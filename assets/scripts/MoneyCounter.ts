import { _decorator, Component, Label, Node } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('MoneyCounter')
export class MoneyCounter extends Component {

    private _label: Label = null;

    onEnable() {
        this._label = this.node.getComponent(Label);
        this._subscribeEvents(true);
    }

    onDisable() {
        this._subscribeEvents(false);
    }


    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.SPENT_MONEY, this.onSpentMoney, this);
        gameEventTarget[func](GameEvent.COLLECT_MONEY, this.onCollectMoney, this);
    }

    onSpentMoney() {
        this._label.string = `${Number(this._label.string) - 1}`
    }

    onCollectMoney(count: number) {
        for (let i = 0; i < count; i++) {
            this.scheduleOnce(() => {
                this._label.string = `${Number(this._label.string) + 1}`
            }, i * 0.15)
        }
    }
}


