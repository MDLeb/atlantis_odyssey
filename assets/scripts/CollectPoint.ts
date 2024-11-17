import { _decorator, CCInteger, Component, Node, Pool, v3, Vec3 } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('CollectPoint')
export class CollectPoint extends Component {
    @property(CCInteger)
    rows: number = 1;

    @property(CCInteger)
    columns: number = 1;

    protected _tempResource: Map<Node, Pool<Node>> = new Map();
    protected _itemSize: Vec3 = v3(1, 1, 1);

    setItemSize(itemSize: Vec3) {
        this._itemSize = itemSize
    }

    getNextPosition(): Vec3 {
        const index = this.node.children.length;

        const floor = Math.floor(index / (this.rows * this.columns));
        const row = Math.floor((index % (this.rows * this.columns)) / this.columns);
        const column = index % this.columns;

        return v3(
            column * this._itemSize.x,
            floor === Infinity ? 0 : floor * this._itemSize.y,
            row * this._itemSize.z
        );
    }
}
