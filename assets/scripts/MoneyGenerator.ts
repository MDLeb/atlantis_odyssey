import { _decorator, Component, Node, tween, v3 } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('MoneyGenerator')
export class MoneyGenerator extends Component {

    private _cashMeshes: Node[] = [];


    onEnable() {
        this._cashMeshes = this.node.children;
        this._cashMeshes.forEach((i: Node) => {
            i.scale = v3(0, 0, 0);
        });
        // this._subscribeEvents(true);
    }

    // onDisable() {
    //     this._subscribeEvents(false);
    // }



    // private _subscribeEvents(isOn: boolean): void {
    //     const func: string = isOn ? 'on' : 'off';

    //     gameEventTarget[func](GameEvent.EXCHANGE_READY, this.onExchangeReady, this);
    //     gameEventTarget[func](GameEvent.EXCHANGE_COMPLETE, this.onExchangeComplete, this);
    // }

    onExchangeReady() {
        this._cashMeshes.forEach((i: Node) => {
            tween(i)
                .to(0.2, { scale: v3(1.1, 1.1, 1.1) })
                .to(0.1, { scale: v3(1, 1, 1) })
                .start()
        });
    }
    onExchangeComplete() {
        this._cashMeshes.forEach((i: Node) => {
            tween(i)
                .to(0.3, { scale: v3(0, 0, 0) })
                .start()
        });
    }


}


