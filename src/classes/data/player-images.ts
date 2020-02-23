import DirectionEnum from '../enums/direction-enum';

import playerRightStood from '../../images/player-right-stood.png';
import playerRight from '../../images/player-right.png';
import playerLeftStood from '../../images/player-left-stood.png';
import playerLeft from '../../images/player-left.png';
import playerUp1 from '../../images/player-up-1.png';
import playerUp2 from '../../images/player-up-2.png';
import playerUp3 from '../../images/player-up-3.png';

const playerImages = {
	[DirectionEnum.STAND]: [playerRightStood],
	[DirectionEnum.UP]: [playerUp1, playerUp2, playerUp1, playerUp3],
	[DirectionEnum.UP_RIGHT]: [],
	[DirectionEnum.RIGHT]: [playerRightStood, playerRight],
	[DirectionEnum.DOWN_RIGHT]: [],
	[DirectionEnum.DOWN]: [playerUp1, playerUp2, playerUp1, playerUp3],
	[DirectionEnum.DOWN_LEFT]: [],
	[DirectionEnum.LEFT]: [playerLeftStood, playerLeft],
	[DirectionEnum.UP_LEFT]: [],
	[DirectionEnum.FLOOR_RIGHT]: [],
	[DirectionEnum.FLOOR_LEFT]: [],
	[DirectionEnum.FALL_DOWN]: [playerRightStood],
	[DirectionEnum.JUMP]: [],
}

export default playerImages;