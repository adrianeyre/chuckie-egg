import ISprite from '../../../classes/interfaces/sprite';
import IPlayer from '../../../classes/interfaces/player';
import IHen from '../../../classes/interfaces/hen';
import ILift from '../../../classes/interfaces/lift';

export default interface IDrawSpriteProps {
	sprite: ISprite | IHen | ILift | IPlayer;
	height: number;
	width: number;
	containerWidth: number;
	onMouseOver?(key: string): void;
	onClick(key: string): void;
	onContextMenu?(key: string): void;
}
