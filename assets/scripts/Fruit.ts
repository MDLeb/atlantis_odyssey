import { _decorator, Collider, Component, log, Node, physics, RigidBody, v3, Vec3 } from 'cc';
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


    protected onEnable(): void {
        this._rigidBody = this.node.getComponent(RigidBody);
        this._collider = this.node.getComponent(Collider)

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
        this.scheduleOnce(() => {
            this._rigidBody.enabled = isOn;
            this._collider.enabled = isOn;
            // this._rigidBody.type = isOn ? physics.ERigidBodyType.DYNAMIC : physics.ERigidBodyType.STATIC;
            isOn && this.unscheduleAllCallbacks();
        }, isOn ? 0 : 1.)
    }

    protected update(dt: number): void {
        if (!this._character) return;
        
        const dist = Vec3.distance(this._character.worldPosition, this.node.worldPosition);
        this.togglePhysics(dist < this._checkDistance);
    }

}


