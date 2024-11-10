import { _decorator, Component, Node, UIOpacity, Animation, CCFloat } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('TutorHand')
export class TutorHand extends Component {

	@property(CCFloat)
	time: number = 3

	private _showTimer: number = this.time;
	private _isActive: boolean = true;


	onEnable() {
		this._subscribeEvents(true);
	}

	onDisable() {
		this._subscribeEvents(false);
	}

	update(deltaTime: number) {
		if (!this._isActive) {
			if (this._showTimer < 0) {
				gameEventTarget.emit(GameEvent.TOGGLE_TUTOR_HAND, true);
			} else {
				this._showTimer -= deltaTime
			}
		}
	}

	frameEvent() {
		console.log('frame event');
	}

	private _subscribeEvents(isOn: boolean): void {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.TOGGLE_TUTOR_HAND, this.onToggleTutorHand, this);
	}

	onToggleTutorHand(isOn: boolean) {
		!isOn && (this._showTimer = this.time);

		if (isOn && !this._isActive) {
			this._isActive = true;
			this.getComponent(UIOpacity).opacity = 255;
			this.getComponent(Animation).play();
		} else if (!isOn && this._isActive) {
			this._isActive = false;
			this.getComponent(Animation).pause();
			this.getComponent(UIOpacity).opacity = 0;
		}
	}
}

