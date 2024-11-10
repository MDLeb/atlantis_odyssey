import { _decorator, CCInteger, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CollectPoint')
export class CollectPoint extends Component {
    @property(Vec3)
    itemSize: Vec3 = v3(1, 1, 1);

    @property(CCInteger)
    rows: number = 1;

    @property(CCInteger)
    columns: number = 1;

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
}
