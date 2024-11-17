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
    number100: SpriteRenderer = null;

    @property(SpriteRenderer)
    number10: SpriteRenderer = null;

    @property(SpriteRenderer)
    number1: SpriteRenderer = null;

    private _count: number = 10;

    setCount(count: number) {
        this._count = count;
        this._renderCount();
    }

    private _renderCount() {
        let nmb100 = '', nmb10 = '', nmb1 = '';

        const countStr = String(this._count).padStart(3, '0');
        [nmb100, nmb10, nmb1] = countStr;

        // Render the hundreds place
        if (this.number100) {
            const spriteMap = this.numbersSprites.find(i => i.count === nmb100);
            if (spriteMap && this._count > 99) {
                this.number100.spriteFrame = spriteMap.sprite;
                this.number100.node.setScale(v3(1, 1, 1));
            } else {
                this.number100.node.setScale(v3(0, 0, 0));
            }
        }

        // Render the tens place
        if (this.number10) {
            const spriteMap = this.numbersSprites.find(i => i.count === nmb10);
            if (spriteMap && this._count > 9) {
                this.number10.spriteFrame = spriteMap.sprite;
                this.number10.node.setScale(v3(1, 1, 1));
            } else {
                this.number10.node.setScale(v3(0, 0, 0));
            }
        }

        // Render the units place
        if (this.number1) {
            const spriteMap = this.numbersSprites.find(i => i.count === nmb1);
            if (spriteMap) {
                this.number1.spriteFrame = spriteMap.sprite;
                this.number1.node.setScale(v3(1, 1, 1));
            } else {
                this.number1.node.setScale(v3(0, 0, 0));
            }
        }
    }
}
