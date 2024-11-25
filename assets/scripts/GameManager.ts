import { _decorator, Component, view, screen } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
import { CTAButton } from './input/CTAButton';
import { ScreenButton } from './input/ScreenButton';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CTAButton)
    ctaButton: CTAButton = null;

    @property(ScreenButton)
    joystick: ScreenButton = null;

    protected onEnable() {
        this._subscribeEvents(true);
        this._onCanvasResize();
    }

    protected onDisable() {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.INTERACTION_UPGRADE, this._onInteractionUpgrade, this);
        view[func]('canvas-resize', this._onCanvasResize, this);
    }

    private _onInteractionUpgrade() {
        this.joystick.enabled = false;
        this.ctaButton.enabled = true
    }

    private _onCanvasResize() {
        const { height, width } = screen.windowSize
        const aspect = width / height;
        const landscape = aspect > 1;
        gameEventTarget.emit(GameEvent.CAMERA_TRANSITION, landscape ? 1 : 0);
    }

}


