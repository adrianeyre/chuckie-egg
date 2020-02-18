import React from 'react';

import IDrawSpriteProps from './interfaces/draw-sprite-props';

export default class DrawSprite extends React.Component<IDrawSpriteProps, {}> {
	private offsetHeight: number = 0;
	private offsetWidth: number = 0;

	public render() {
		if (!this.props.sprite.visable) return <div></div>

		return <div key={ this.props.sprite.key } style={ this.styleSprite(this.props.sprite.x, this.props.sprite.y) }>
			<img
				src={ this.props.sprite.image }
				height={ this.props.height * this.props.sprite.height }
				width={ this.props.width * this.props.sprite.width }
				alt="sprite"
				onMouseOver={ this.onMouseOver }
				onClick={ this.onClick }
				onContextMenu={ this.onContextMenu }
			/>
		</div>
	}

	private styleSprite = (x: number, y: number) => ({
		width: 0,
		height: 0,
		opacity: 1,
		WebkitTransform: `translate3d(${ (x - 1) * this.props.width + this.offsetWidth }px, ${ this.offsetHeight + (y - 1) * this.props.height }px, 0)`,
		transform: `translate3d(${ (x - 1) * this.props.width + this.offsetWidth }px, ${ this.offsetHeight + (y - 1) * this.props.height }px, 0)`,
		zIndex: this.props.sprite.zIndex,
	})

	private onClick = (): void => this.props.onClick(this.props.sprite.key);

	private onContextMenu = (): void => {
		if (this.props.onContextMenu) this.props.onContextMenu(this.props.sprite.key);
	}

	private onMouseOver = (): void => {
		if (this.props.onMouseOver) this.props.onMouseOver(this.props.sprite.key);
	}
}
