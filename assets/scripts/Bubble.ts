import { _decorator, Node, Billboard, builtinResMgr, CCFloat, CCInteger, Color, Component, director, EffectAsset, gfx, Material, Mesh, MeshRenderer, renderer, Sprite, SpriteFrame, Texture2D, toDegree, toRadian, utils, Vec4, Camera, v3, SpriteRenderer, tween, instantiate, CCBoolean, Vec3 } from 'cc';
import { CounterRenderer } from './CounterRenderer';
const { ccclass, property } = _decorator;

@ccclass('Bubble')
export class Bubble extends Component {

    @property(CounterRenderer)
    counterRenderer: CounterRenderer = null;

    @property(SpriteRenderer)
    progressSprite: SpriteRenderer = null;


    @property(CCBoolean)
    lookAtCamera: boolean = true;


    protected _camera: Node = null;
    protected _startScale: Vec3 = null;

    protected onEnable(): void {
        this._camera = director.getScene().getComponentInChildren(Camera)?.node;
        this._startScale = this.node.scale.clone();

        const newMaterial = new Material();
        const material = this.progressSprite.getRenderMaterial(0);
        newMaterial.copy(material);

        this.progressSprite.setSharedMaterial(newMaterial, 0);
    }

    public setCounter(count: number, maxCount: number = 10) {
        this.counterRenderer.setCount(maxCount - count);

        const material = this.progressSprite.getSharedMaterial(0);
        const progress = { value: material.getProperty('progressValue') };

        tween(progress)
            .to(0.2, { value: count / maxCount }, {
                onUpdate: () => {
                    material.setProperty('progressValue', progress.value as number);
                }
            })
            .start();
    }

    public toggle(show: boolean = true) {
        tween(this.node)
            .to(0.3, { scale: this._startScale.clone().multiplyScalar(show ? 1 : 0) })
            .start();
    }

    protected update(dt: number): void {
        if (this._camera && this.lookAtCamera) {
            this.node.lookAt(this._camera.worldPosition);
        }
    }

}
