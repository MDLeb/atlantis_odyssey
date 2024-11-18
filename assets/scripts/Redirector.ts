import { _decorator, Component } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('Redirector')
export class Redirector extends Component {
	@property
	iOsUrl: string = '';

	@property
	androidUrl: string = '';

	private _currentStoreLink: string = ''

	protected onLoad() {
		//@ts-ignore
		window.gameReady && window.gameReady();
	}

	protected onEnable() {
		this._currentStoreLink = /android/i.test(navigator.userAgent) ?
			this.androidUrl : this.iOsUrl;

		this._subscribeEvents(true);
	}

	protected onDisable() {
		this._subscribeEvents(false);
	}

	private _subscribeEvents(isOn: boolean): void {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.REDIRECT_PROCESSING, this.onRedirectProcessing, this);
	}

	private onRedirectProcessing() {
		try {
			//@ts-ignore
			window.AdRedirectProcessing();
		} catch (e) {
			window.open(this._currentStoreLink);
		}
	}
}


