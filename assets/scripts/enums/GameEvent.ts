export enum GameEvent {
	NONE,

	REGISTER_BUTTON,
	UNREGISTER_BUTTON,
	REDIRECT_PROCESSING,

	CAMERA_TRANSITION,
	CAMERA_SHAKE,

	TOGGLE_TUTOR_HAND,

	JOYSTICK_MOVE_START,
	JOYSTICK_MOVE,
	JOYSTICK_MOVE_END,

	CORRECT_VELOCITY,

	INTERACTION_START,
	INTERACTION,
	INTERACTION_END,
	INTERACTION_UPGRADE,

	COLLECT_ITEM,//просто собираем на локации (из пустоты)
	COLLECT_MONEY,//забираем деньги
	SPENT_MONEY,//тратим деньги

	RESOURCE_RECEIVE,//нода отдала чайлдов, принимаем на другой
	RESOURCE_EXCHANGE, //когда готовы забирать с одной ноды и перекладывать в другую



}