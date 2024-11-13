import { _decorator, Node, Billboard, builtinResMgr, CCFloat, CCInteger, Color, Component, director, EffectAsset, gfx, Material, Mesh, MeshRenderer, renderer, Sprite, SpriteFrame, Texture2D, toDegree, toRadian, utils, Vec4, Camera, v3, SpriteRenderer, tween, instantiate, CCBoolean } from 'cc';
import { CounterRenderer } from './CounterRenderer';
const { ccclass, property, executeInEditMode, type } = _decorator;



@ccclass('Bubble')
export class Bubble extends Component {

    @property(CounterRenderer)
    counterRenderer: CounterRenderer = null;

    @property(SpriteRenderer)
    progressSprite: SpriteRenderer = null;


    @property(CCBoolean)
    lookAtCamera: boolean = true;


    protected _camera: Node = null;

    protected onEnable(): void {
        this._camera = director.getScene().getComponentInChildren(Camera)?.node;

        const newMaterial = new Material();
        const material = this.progressSprite.getRenderMaterial(0);
        newMaterial.copy(material);

        // Применяем клонированный материал к спрайту
        this.progressSprite.setSharedMaterial(newMaterial, 0);
    }

    public setCounter(count: number, maxCount: number = 10) {
        this.counterRenderer.setCount(count);
        if (count > 0) {
            this.counterRenderer.setCount(count);
            this.node.setScale(v3(1, 1, 1));
            const material = this.progressSprite.getSharedMaterial(0);
            const progress = { value: material.getProperty('progressValue') };

            tween(progress)
                .to(0.2, { value: (maxCount - count) / maxCount }, {
                    onUpdate: () => {
                        material.setProperty('progressValue', progress.value as number);
                        // console.log(progress.value);
                    }
                })
                .start();
        } else {
            this.node.scale.multiplyScalar(0);
        }
    }

    protected update(dt: number): void {
        if (this._camera && this.lookAtCamera) {
            this.node.lookAt(this._camera.worldPosition);
        }
    }

}
