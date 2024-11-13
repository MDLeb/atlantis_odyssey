import { _decorator, CCInteger, Component, Node, Pool, v3, Vec3 } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('CollectPoint')
export class CollectPoint extends Component {
    @property(Vec3)
    itemSize: Vec3 = v3(1, 1, 1);

    @property(CCInteger)
    rows: number = 1;

    @property(CCInteger)
    columns: number = 1;

    protected _tempResource: Map<Node, Pool<Node>> = new Map();

    protected onEnable(): void {
        this._subscribeEvents(true)
    }
    protected onDisable(): void {
        this._subscribeEvents(false)

    }
    private _subscribeEvents(isOn: boolean) {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.EXCHANGE_READY, this.onExchangeReady, this);
	}


    getNextPosition(): Vec3 {
        const index = this.node.children.length;

        const floor = Math.floor(index / (this.rows * this.columns));
        const row = Math.floor((index % (this.rows * this.columns)) / this.columns);
        const column = index % this.columns;

        return v3(
            column * this.itemSize.x,
            floor * this.itemSize.y,
            row * this.itemSize.z
        );
    }

    setTempResource(node: Node, pool: Pool<Node>) {
        this._tempResource.set(node, pool);
    }

    onExchangeReady(parentNode: Node) {
        if(this.node.parent !== parentNode) return;
        
        
        for (let [node, pool] of this._tempResource) {
            this.node.removeChild(node)
            pool.free(node);
        }
    }
}
