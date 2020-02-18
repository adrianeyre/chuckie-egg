import IPlayer from './interfaces/player';
import IPlayerConfig from './interfaces/player-config'
import DirectionEnum from './enums/direction-enum';

export default class Player implements IPlayer {
	public key: string;
	public direction: DirectionEnum;

	constructor(config: IPlayerConfig) {
		this.key = config.key;
		this.direction = DirectionEnum.STAND;
	}
}
