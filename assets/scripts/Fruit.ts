import { _decorator, Collider, Component, Node, physics, RigidBody, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Fruit')
export class Fruit extends Component {

    private _rigidBody: RigidBody = null;
    private _collider: Collider = null;
    private _character: Node;
    private _checkDistance = 1;

    protected onEnable(): void {
        this._rigidBody = this.node.getComponent(RigidBody);
        this._collider = this.node.getComponent(Collider);
        this._collider.enabled = true;

        //for config creation
        // if (this.node.name === 'orange') {
        // if (this.node.name === 'watermelon') {
        //     this.togglePhysics(true);

        //     this.scheduleOnce(() => {
        //         console.log(this.node.worldPosition, this.node.worldRotation);
        //     }, 10)
        // }
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
            const vel = v3();
            this._rigidBody.getLinearVelocity(vel)
            if (dist > this._checkDistance && vel.length() < 0.1) {
                this._rigidBody.type = physics.ERigidBodyType.STATIC;
            } else {
                this._rigidBody.type = physics.ERigidBodyType.DYNAMIC;
            }
            isOn && this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                this.togglePhysics(vel.length() > 0.1);
            }, 1.2);
        }
    }

    protected update(dt: number): void {
        if (!this._character) return;

        const dist = Vec3.distance(this._character.worldPosition, this.node.worldPosition);
        this.togglePhysics(dist < this._checkDistance + 2);
    }
}


