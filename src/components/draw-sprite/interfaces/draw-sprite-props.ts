import ISprite from '../../../classes/interfaces/sprite';

export default interface IDrawSpriteProps {
	sprite: ISprite;
	height: number;
	width: number;
	containerWidth: number;
	onMouseOver?(key: string): void;
	onClick(key: string): void;
	onContextMenu?(key: string): void;
}
