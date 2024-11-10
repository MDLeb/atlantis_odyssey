import { _decorator, Component, SkeletalAnimation, Node, v3, Vec2, Vec3, animation } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('CharacterMovements')
export class CharacterMovements extends Component {

	@property
	moveSpeed: number = 100;

	@property
	interRadius: number = 3;

	private _cVelocity: Vec3 = v3();
	private _isTakingInput: boolean = true;
	private _animationController: animation.AnimationController = null;


	onEnable() {
		this._subscribeEvents(true);
		this._animationController = this.node.getComponentInChildren(animation.AnimationController);
	}

	onDisable() {
		this._subscribeEvents(false);
	}

	update(dt: number) {
		if (this._cVelocity.length() > 0) {
			let velocity = Vec3.multiplyScalar(v3(), this._cVelocity, dt);

			gameEventTarget.emit(GameEvent.CORRECT_VELOCITY, this.node.worldPosition,
				this.interRadius, velocity, newVel => velocity = newVel);

			this.node.setWorldPosition(this.node.worldPosition.clone().add(velocity));

			const angle = Math.atan2(this._cVelocity.x, this._cVelocity.z) / Math.PI * 180;
			this.node.eulerAngles = v3(0, angle, 0);
		}

		// gameEventTarget.emit(GameEvent.CHECK_INTERACTION, this.node.worldPosition, this.interRadius);
	}

	private _subscribeEvents(isOn: boolean) {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.JOYSTICK_MOVE, this.onJoystickMove, this);
		gameEventTarget[func](GameEvent.JOYSTICK_MOVE_END, this.onJoystickMoveEnd, this);
	}

	onJoystickMove(cPos: Vec2, delta: Vec2) {
		this._animationController.setValue('IsMoving', true);

		if (delta.length() > 0 && this._isTakingInput) {
			this._cVelocity.x = delta.x * this.moveSpeed / delta.length();
			this._cVelocity.z = - delta.y * this.moveSpeed / delta.length();
		}
	}

	onJoystickMoveEnd() {
		this._animationController.setValue('IsMoving', false);

		this._cVelocity = v3();
	}

}

