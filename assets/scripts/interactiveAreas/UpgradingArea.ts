import { _decorator, CCInteger, Component, Enum, Node, Script } from 'cc';
import { InteractiveArea } from './InteractiveArea';
import { CollectableItems } from '../CollectableItems';
import { GameEvent } from '../enums/GameEvent';
import { gameEventTarget } from '../GameEventTarget';
import { Bubble } from '../Bubble';
import { ExchangingArea } from './ExchangingArea';
import { FruitGenerator } from '../FruitGenerator';
const { ccclass, property } = _decorator;

@ccclass('UpgradingArea')
export class UpgradingArea extends ExchangingArea {

    protected _orderedCount: number = 10;
    protected _receivedCount: number = 0;
    protected _upgradeIsReady: boolean = false;
    protected _inactiveComponent: Component[] = [];

    onEnable(): void {
        super.onEnable();
        this._inactiveComponent = this.node.getComponents(Component).filter(i => !i.enabled);
    }

    receive(count: number = 1) {
        this._receivedCount = Math.min(this._orderedCount, this._receivedCount + count);
        if (this._receivedCount >= this._orderedCount) {

            // const newComponent = this.node.getComponent(FruitGenerator);
            // newComponent.enabled = true;
            this.enabled = false;
            this._inactiveComponent.forEach((i) => i.enabled = true);
            this.bubble.node.active = false;

            this.itemName = CollectableItems.MONEY;
            this._upgradeIsReady = true;
        }
        this.bubble.setCounter(this._orderedCount - this._receivedCount, this._orderedCount);
    }

    onTriggerEnter() {
        if (this._upgradeIsReady) {
            gameEventTarget.emit(GameEvent.INTERACTION_START, this.itemName, false, this._orderedCount, this.node);
            // gameEventTarget.emit(GameEvent.EXCHANGE_COMPLETE, this.node);
            this._upgradeIsReady = false;
        } else {
            const count = this._orderedCount - this._receivedCount;
            gameEventTarget.emit(GameEvent.INTERACTION_START, this.itemReceiveName, true, count, this.node)
        }
    }
}


