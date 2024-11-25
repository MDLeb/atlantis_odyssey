import { _decorator, Component, Enum, Node } from 'cc';
import { GameEvent } from '../enums/GameEvent';
import { gameEventTarget } from '../GameEventTarget';
import { CollectableItems } from '../CollectableItems';
const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    @property({ type: Enum(CollectableItems) })
    fruit: CollectableItems = CollectableItems.NONE;


    protected onEnable() {
        this._subscribeEvents(true);
    }

    protected onDisable() {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.INTERACTION, this.onInteraction, this)
    }

    private onInteraction(node: Node) {
        if (this.node !== node) return;
        gameEventTarget.emit(GameEvent.COLLECT_ITEM, this.fruit)
    }

}


