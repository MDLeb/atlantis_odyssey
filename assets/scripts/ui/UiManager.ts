import { _decorator, Component, EventTouch, Node } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {
	@property(Node)
	joystickButton: Node;

	@property(Node)
	redirectButton;

	private _hasUpgrade: boolean = false;

	onEnable() {
		this._subscribeEvents(true);
	}

	onDisable() {
		this._subscribeEvents(false);
	}

	update(deltaTime: number) {
		
	}

	_subscribeEvents(isOn: boolean) {
		const func = isOn? 'on': 'off';

		gameEventTarget[func](GameEvent.CHARACTER_UPGRADE, this.onCharacterUpgrade, this);
		gameEventTarget[func](GameEvent.JOYSTICK_MOVE_END, this.onJoystickMoveEnd, this);
	}

	onCharacterUpgrade() {
		this._hasUpgrade = true;		
	}

	onJoystickMoveEnd() {
		if (this._hasUpgrade) {
			this.scheduleOnce(() => {
				this.joystickButton.active = false;
				this.redirectButton.active = true;
			});			
		}
		
	}
}

