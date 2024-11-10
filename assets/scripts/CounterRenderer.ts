import { _decorator, CCInteger, CCString, Component, Node, SpriteFrame, SpriteRenderer, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteMap')
export class SpriteMap {
    @property(CCString)
    count: string = '0';

    @property(SpriteFrame)
    sprite: SpriteFrame = null;
}

@ccclass('CounterRenderer')
export class CounterRenderer extends Component {

    @property([SpriteMap])
    numbersSprites: SpriteMap[] = [];

    @property(SpriteRenderer)
    number10: SpriteRenderer = null;

    @property(SpriteRenderer)
    number1: SpriteRenderer = null;


    private _count: number = 0;

    setCount(count: number) {
        this._count = count;
        this._renderCount();
    }

    private _renderCount() {
        let nmb10: string, nmb1: string;

        if (this._count > 9) {
            [nmb10, nmb1] = String(this._count)
        } else {
            [nmb1] = String(this._count)
        }

        if (nmb10) {
            this.number10.spriteFrame = this.numbersSprites.find(i => i.count === nmb10).sprite;
            this.number1.node.position = v3(
                this.number10.node.position.x * -1, this.number1.node.position.y, this.number1.node.position.z
            )
        } else {
            this.number10.node.scale.multiplyScalar(0);
            this.number1.node.position = v3(
                0, this.number1.node.position.y, this.number1.node.position.z
            )
        }

        if (nmb1) {
            this.number1.spriteFrame = this.numbersSprites.find(i => i.count === nmb1).sprite
        } else {
            this.number1.node.scale.multiplyScalar(0);
        }

    }
}


