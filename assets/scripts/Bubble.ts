import { _decorator, Node, Billboard, builtinResMgr, CCFloat, CCInteger, Color, Component, director, EffectAsset, gfx, Material, Mesh, MeshRenderer, renderer, Sprite, SpriteFrame, Texture2D, toDegree, toRadian, utils, Vec4, Camera, v3 } from 'cc';
import { CounterRenderer } from './CounterRenderer';
const { ccclass, property, executeInEditMode, type } = _decorator;



@ccclass('Bubble')
export class Bubble extends Component {

    @property(CounterRenderer)
    counterRenderer: CounterRenderer = null;

    protected _camera: Node = null;

    protected onEnable(): void {
        this._camera = director.getScene().getComponentInChildren(Camera)?.node;
    }

    public setCounter(count: number) {
        this.counterRenderer.setCount(count);
        if (count > 0) {
            this.counterRenderer.setCount(count);
            this.node.setScale(v3(1, 1, 1));
        } else {
            this.node.scale.multiplyScalar(0);
        }
    }

    protected update(dt: number): void {
        if (this._camera) {
            this.node.lookAt(this._camera.worldPosition);
        }
    }

}
