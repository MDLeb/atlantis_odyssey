import { _decorator, Component, Node, EventTouch } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass } = _decorator;

@ccclass('CTAButton')
export class CTAButton extends Component {

	onEnable() {
		this._subscribeEvents(true);
		console.log(this.node.name);

	}

	onDisable() {
		this._subscribeEvents(false);
	}

	private _subscribeEvents(isOn: boolean): void {
		const func: string = isOn ? 'on' : 'off';

		this.node[func](Node.EventType.TOUCH_START, this.onTouch, this);
		this.node[func](Node.EventType.TOUCH_END, this.onTouch, this);
		this.node[func](Node.EventType.TOUCH_CANCEL, this.onTouch, this);
	}

	onTouch(event: EventTouch): void {
		gameEventTarget.emit(GameEvent.JOYSTICK_MOVE_END, event);
		gameEventTarget.emit(GameEvent.REDIRECT_PROCESSING);
	}
}


