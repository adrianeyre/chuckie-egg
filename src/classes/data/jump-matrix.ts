import IJumpMatrix from '../interfaces/jump-matrix';
import DirectionEnum from '../enums/direction-enum';

const jumpMatrix: IJumpMatrix = {
	[DirectionEnum.UP]: [
		{ direction: DirectionEnum.UP, x: 0, y: -1 },
		{ direction: DirectionEnum.UP, x: 0, y: -1 },
		{ direction: DirectionEnum.DOWN, x: 0, y: 1 },
		{ direction: DirectionEnum.DOWN, x: 0, y: 1 },
		{ direction: DirectionEnum.DOWN, x: 0, y: 0 },
	],
	[DirectionEnum.DOWN]: [
		{ direction: DirectionEnum.DOWN, x: 0, y: 1 },
	],
	[DirectionEnum.RIGHT]: [
		{ direction: DirectionEnum.UP, x: 0, y: -1 },
		{ direction: DirectionEnum.UP, x: 1, y: -1 },
		{ direction: DirectionEnum.UP, x: 1, y: -1 },
		{ direction: DirectionEnum.DOWN, x: 1, y: 1 },
	],
	[DirectionEnum.LEFT]: [
		{ direction: DirectionEnum.UP, x: 0, y: -1 },
		{ direction: DirectionEnum.UP, x: -1, y: -1 },
		{ direction: DirectionEnum.UP, x: -1, y: -1 },
		{ direction: DirectionEnum.DOWN, x: -1, y: 1 },
	],
}

export default jumpMatrix