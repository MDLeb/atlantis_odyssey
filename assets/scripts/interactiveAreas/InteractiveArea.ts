import { _decorator, Component, Collider, Enum } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;


@ccclass('InteractiveArea')
export class InteractiveArea extends Component {

	private _collider: Collider = null;
	private _interactionUpdate: boolean = false;

	onEnable() {
		this._collider = this.node.getComponent(Collider);
		this._subscribeEvents(true);
	}

	onDisable() {
		this._subscribeEvents(false);
	}

	private _subscribeEvents(isOn: boolean): void {
		const func: string = isOn ? 'on' : 'off';

		this._collider[func]("onTriggerEnter", this.onTriggerEnter, this);
		this._collider[func]("onTriggerExit", this.onTriggerExit, this);

	}

	onTriggerEnter() {
		gameEventTarget.emit(GameEvent.INTERACTION_START, this.node)
		this._interactionUpdate = true;
	}

	onTriggerExit() {
		this._interactionUpdate = false;
		gameEventTarget.emit(GameEvent.INTERACTION_END, this.node)
	}

	update() {
		if (this._interactionUpdate) {
			gameEventTarget.emit(GameEvent.INTERACTION, this.node)
		}
	}
}