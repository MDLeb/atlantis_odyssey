import { _decorator, Component, Node } from 'cc';
import { InteractiveArea } from './InteractiveArea';
import { CollectableItems } from '../CollectableItems';
import { GameEvent } from '../enums/GameEvent';
import { gameEventTarget } from '../GameEventTarget';
import { Bubble } from '../Bubble';
const { ccclass, property } = _decorator;

@ccclass('ExchangingArea')
export class ExchangingArea extends InteractiveArea {

    @property(Bubble)
    bubble: Bubble = null;

    private _orderedCount: number = 10;
    private _receivedCount: number = 0;
    private _cashIsReady: boolean = false;

    onEnable(): void {
        super.onEnable();
        this.order(10);
    }

    order(count: number = 1) {
        this._orderedCount = count;
        this.bubble.setCounter(count);
    }

    receive(count: number = 1) {
        this._receivedCount = Math.min(this._orderedCount, this._receivedCount + count);
        if (this._receivedCount >= this._orderedCount) {
            gameEventTarget.emit(GameEvent.EXCHANGE_READY, this.node);
            this.itemName = CollectableItems.MONEY;
            this._cashIsReady = true;
        }
        this.bubble.setCounter(this._orderedCount - this._receivedCount);
    }

    onTriggerEnter() {
        if (this._cashIsReady) {
            gameEventTarget.emit(GameEvent.INTERACTION_START, this.itemName, false, this._orderedCount, this.node);
            gameEventTarget.emit(GameEvent.EXCHANGE_COMPLETE, this.node);
            this._cashIsReady = false;
        } else {
            const count = this._orderedCount - this._receivedCount;
            gameEventTarget.emit(GameEvent.INTERACTION_START, this.itemName, true, count, this.node)
        }
    }
}


