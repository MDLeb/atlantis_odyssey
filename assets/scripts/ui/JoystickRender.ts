import { _decorator, Camera, Component, Node, UIOpacity, v3, Vec2, Vec3 } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('JoystickRender')
export class JoystickRender extends Component {
	@property({
		type: Camera
	})
	uiCamera: Camera;

	@property({
		type: Node
	})
	innerCircle: Node;

	@property
	maxRadius: number = 100;

	private _isActive = false;

	onEnable() {
		this._subscribeEvents(true);
	}

	onDisable() {
		this._subscribeEvents(false);
	}

	update(deltaTime: number) {
		
	}

	private _subscribeEvents(isOn: boolean) {
		const func = isOn? 'on': 'off';

		gameEventTarget[func](GameEvent.JOYSTICK_MOVE_START, this.onJoystickMoveStart, this);
		gameEventTarget[func](GameEvent.JOYSTICK_MOVE_END, this.onJoystickMoveEnd, this);
		gameEventTarget[func](GameEvent.JOYSTICK_MOVE, this.onJoystickMove, this);
	}

	onJoystickMoveStart(startPos: Vec2) {
		this._isActive = true;
		this.getComponent(UIOpacity).opacity = 255;

		const startWorldPos = this.uiCamera.screenToWorld(v3(startPos.x, startPos.y, 0));
		this.node.worldPosition = startWorldPos;
		this.innerCircle.setPosition(v3());
	}

	onJoystickMoveEnd() {
		this._isActive = false;
		this.getComponent(UIOpacity).opacity = 0;
	}

	onJoystickMove(cJoystickPos: Vec2) {
		if (this._isActive) {
			const cJoystickWorldPos = this.uiCamera.screenToWorld(v3(cJoystickPos.x,
				cJoystickPos.y, 0));
			
			const delta = Vec3.subtract(v3(), cJoystickWorldPos, this.node.worldPosition);
			const radius = Math.min(this.maxRadius, delta.length());
			delta.normalize();
			const offset = delta.multiplyScalar(radius);

			this.innerCircle.position = offset;
		}
	}
}