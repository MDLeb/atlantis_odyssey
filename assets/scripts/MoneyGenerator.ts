import { _decorator, Component, Node, tween, v3 } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass } = _decorator;

@ccclass('MoneyGenerator')
export class MoneyGenerator extends Component {

    private _cashMeshes: Node[] = [];

    protected onEnable() {
        this._cashMeshes = this.node.children;
        this._cashMeshes.forEach((i: Node) => {
            i.scale = v3(0, 0, 0);
        });
    }

    public onExchangeReady() {
        gameEventTarget.emit(GameEvent.GENERATE_MONEY_SOUND)
        this._cashMeshes.forEach((i: Node) => {
            tween(i)
                .to(0.2, { scale: v3(1.1, 1.1, 1.1) })
                .to(0.1, { scale: v3(1, 1, 1) })
                .start()
        });
    }
    public onExchangeComplete() {
        this._cashMeshes.forEach((i: Node) => {
            tween(i)
                .to(0.3, { scale: v3(0, 0, 0) })
                .start()
        });
    }
}


