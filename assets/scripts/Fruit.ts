import { _decorator, Collider, Component, log, MeshRenderer, Node, physics, RigidBody, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Fruit')
export class Fruit extends Component {
    // @property()
    // maxTime = 0.3;

    private _rigidBody: RigidBody = null;
    private _collider: Collider = null;
    private _time: number = 0;
    private _character: Node;
    private _checkDistance = 1;
    private _mask: number;
    
    private _meshHelperDynamic: Node;
    private _meshHelperStatic: Node;

    protected onEnable(): void {
        this._rigidBody = this.node.getComponent(RigidBody);
        this._collider = this.node.getComponent(Collider);
        this._mask = this._collider.getMask();

        this._meshHelperDynamic = this.node.getChildByName('helper-dynamic');
        this._meshHelperDynamic.active = false;

        this._meshHelperStatic = this.node.getChildByName('helper-static');
        this._meshHelperStatic.active = false;


        // if (this.node.name === 'orange') {
        // if (this.node.name === 'watermelon') {
        //     this.togglePhysics(true);
        //     this.scheduleOnce(() => {
        //         console.log(this.node.worldPosition, this.node.worldRotation);
        //     }, 10)
        // }
        // this.togglePhysics(false)
        this._collider.enabled = true;
    }

    setCharacter(character: Node) {
        this._character = character;
    }

    togglePhysics(isOn: boolean) {
        this._rigidBody.enabled = isOn;
        this._collider.enabled = isOn;
        if (isOn) {
            let dist: number;
            if (this._character) {
                dist = Vec3.distance(this._character.worldPosition, this.node.worldPosition);
            }
            if (dist > this._checkDistance) {
                this._meshHelperDynamic.active = false;
                this._meshHelperStatic.active = true;
                this._rigidBody.type = physics.ERigidBodyType.STATIC;
            } else {
                this._meshHelperDynamic.active = true;
                this._meshHelperStatic.active = false;
                this._rigidBody.type = physics.ERigidBodyType.DYNAMIC;
            }
            isOn && this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                this.togglePhysics(false);
                this._meshHelperDynamic.active = false;
                this._meshHelperStatic.active = false;
            }, 0.5);
        }
    }
}


