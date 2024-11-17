import { FruitGenerator } from './../FruitGenerator';
import { _decorator, CCClass, CCInteger, Component, Enum, Node, Pool, tween, v3 } from 'cc';
import { areaStates, ExchangingArea2 } from './ExchangingArea2';
import { InteractiveArea } from './InteractiveArea';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;


@ccclass('UpgradingArea')
export class UpgradingArea extends ExchangingArea2 {
    @property(Node)
    toActivateNode: Node = null;

    protected _state: areaStates = areaStates.RECEIVE;
    protected _count: number = 10;


    _onExchangeReady() {
        this._state = areaStates.NONE;
        this.bubbleCounter.toggle(false);
        this.collectPoint.node.removeAllChildren();

        gameEventTarget.emit(GameEvent.INTERACTION_UPGRADE, this.node);

        const component1 = this.toActivateNode.getComponent(FruitGenerator);
        const component2 = this.toActivateNode.getComponent(InteractiveArea);
        component1.enabled = true;
        component2.enabled = true;
        this.node.active = false;
    }


}


