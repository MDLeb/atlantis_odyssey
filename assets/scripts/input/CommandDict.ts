import { Vec2 } from "cc";
import { gameEventTarget } from "../GameEventTarget"
import { GameEvent } from "../enums/GameEvent"
import { ScreenButton } from "./ScreenButton";

export const CommandDict = {
	joystickMoveStartCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.JOYSTICK_MOVE_START, button.touchStartPos);
	},

	joystickMoveCommand(button: ScreenButton) {
		if (button.touchCurrPos && button.touchStartPos) {
			let delta = new Vec2();
			Vec2.subtract(delta, button.touchCurrPos, button.touchStartPos);
			gameEventTarget.emit(GameEvent.JOYSTICK_MOVE, button.touchCurrPos, delta);
		}		
	},

	joystickMoveEndCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.JOYSTICK_MOVE_END);
	},

	redirectCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.JOYSTICK_MOVE_END);
		gameEventTarget.emit(GameEvent.REDIRECT_PROCESSING);
	}
}

