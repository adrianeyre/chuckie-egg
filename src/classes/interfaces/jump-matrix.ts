import DirectionEnum from '../enums/direction-enum';

interface IMatrix {
	direction: DirectionEnum;
	x: number;
	y: number;
}

export default interface IJumpMatrix {
	[key: number]: IMatrix[];
}