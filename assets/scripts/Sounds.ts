import { _decorator, AudioClip, AudioSource, Component, Enum, Node } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('SoundEvent')
export class SoundEvent {
    @property(AudioSource)
    sound: AudioSource;

    @property({
		type: Enum(GameEvent)
	})
	event: GameEvent = GameEvent.NONE;
}

@ccclass('Sounds')
export class Sounds extends Component {

    @property([SoundEvent])
    soundMap: SoundEvent[] = [];

    protected onEnable(): void {
        this._subscribeEvents(true);
    }

    protected onDestroy(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        this.soundMap.forEach(e => {
            gameEventTarget[func](e.event, () => e.sound.play())
        })

    }

   

}

