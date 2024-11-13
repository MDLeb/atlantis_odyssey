import { _decorator, Component, Collider, Enum } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { CollectableItems } from '../CollectableItems';
import { CollectPoint } from '../CollectPoint';
const { ccclass, property } = _decorator;


@ccclass('InteractiveArea')
export class InteractiveArea extends Component {
	@property({ type: Enum(CollectableItems) })
	itemName: CollectableItems = CollectableItems.NONE

	private _collider: Collider = null;

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
		gameEventTarget.emit(GameEvent.INTERACTION_START, this.itemName, false, Infinity, this.node)
	}

	onTriggerExit() {
		gameEventTarget.emit(GameEvent.INTERACTION_END, this.itemName, this.node)
	}
}