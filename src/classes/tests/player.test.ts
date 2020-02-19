import Player from '../player';
import IPlayerProps from '../interfaces/player-config';
import IPlayer from '../interfaces/player';
import DirectionEnum from '../enums/direction-enum';

describe('Player', () => {
	let defaultConfig: IPlayerProps
	let player: IPlayer;

	beforeEach(() => {
		defaultConfig = {
			key: 'player',
			visable: true,
			x: 1,
			y: 1,
			height: 1,
			width: 1,
		}

		player = new Player(defaultConfig);
	})

	it('Should create Player class', () => {
		expect(player.key).toEqual('player');
		expect(player.direction).toEqual(DirectionEnum.STAND);
	});
});