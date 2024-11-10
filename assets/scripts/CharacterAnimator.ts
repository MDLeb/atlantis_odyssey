import { _decorator, Component, Node, Animation, Enum, CCString } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('AnimatorMap')
export class AnimatorMap {
    @property({ type: Enum(GameEvent) })
    event: GameEvent = GameEvent.NONE;

    @property(CCString)
    clip: string = '';
}

enum Character_state { IDLE, RUN };

@ccclass('CharacterAnimator')
export class CharacterAnimator extends Component {

    @property([AnimatorMap])
    animatorMap: AnimatorMap[] = [];

    private _animation: Animation;
    private _state: Character_state = Character_state.IDLE;

    onEnable() {
        this._subscribeEvents(true);
        this._animation = this.node.getComponent(Animation);
    }

    onDisable() {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.CHARACTER_RUN, this.onCharacterRun, this);
        gameEventTarget[func](GameEvent.CHARACTER_STOP, this.onCharacterIdle, this);


    }

    onCharacterRun() {
        if (this._state === Character_state.RUN) return;

        this._state = Character_state.RUN;
        this._animation.crossFade(this.animatorMap.find(anim => anim.event === GameEvent.CHARACTER_RUN).clip, 0.2)

    }

    onCharacterIdle() {
        if (this._state === Character_state.IDLE) return;

        this._state = Character_state.IDLE;
        this._animation.crossFade(this.animatorMap.find(anim => anim.event === GameEvent.CHARACTER_STOP).clip, 0.2)
    }

}


