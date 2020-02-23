import ISprite from '../../../classes/interfaces/sprite';
import IPlayer from '../../../classes/interfaces/player';
import IHen from '../../../classes/interfaces/hen';

export default interface IDrawSpriteProps {
	sprite: ISprite | IHen | IPlayer;
	height: number;
	width: number;
	containerWidth: number;
	onMouseOver?(key: string): void;
	onClick(key: string): void;
	onContextMenu?(key: string): void;
}
