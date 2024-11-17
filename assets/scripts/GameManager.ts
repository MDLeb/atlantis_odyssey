import { _decorator, CCFloat, Component, Node } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
import { CTAButton } from './input/CTAButton';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CTAButton)
    ctaButton: CTAButton = null;

    @property(Node)
    tutorial: Node = null;

    @property(CCFloat)
    tutorialTime: number = 2;

    private _tutorTimer: number = 0;

    onEnable() {
        this._subscribeEvents(true);
    }

    onDisable() {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.JOYSTICK_MOVE, this.onJoystickMove, this);
        gameEventTarget[func](GameEvent.INTERACTION_UPGRADE, this.onInteractionUpgrade, this);
    }

    onJoystickMove() {
        this.tutorial.active = false;
        this._tutorTimer = 0;
    }

    onInteractionUpgrade() {
        this.ctaButton.enabled = true
    }

    protected update(dt: number): void {
        if(!this.tutorial.active){
            this._tutorTimer += dt;
            if(this._tutorTimer >= this.tutorialTime){
                this.tutorial.active = true;
            }
        }
    }


}


