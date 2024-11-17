import { _decorator, Component, Node } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
import { CTAButton } from './input/CTAButton';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CTAButton)
    ctaButton: CTAButton = null;

    onEnable() {
        this._subscribeEvents(true);
    }

    onDisable() {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.INTERACTION_UPGRADE, this.onInteractionUpgrade, this);
    }

    onInteractionUpgrade() {
        this.ctaButton.enabled = true
    }


}


