import React from 'react';

import Game from '../../classes/game';
import ISprite from '../../classes/interfaces/sprite';
import IChuckieEggProps from './interfaces/chuckie-egg-props';
import IChuckieEggState from './interfaces/chuckie-egg-state';
import DrawSprite from '../draw-sprite/draw-sprite';
import InfoBoard from '../info-board/info-board';

import './styles/chuckie-egg.scss';
import PlayerResultEnum from 'classes/enums/player-result-enum';

export default class ChuckieEgg extends React.Component<IChuckieEggProps, IChuckieEggState> {
	private SPRITE_BLOCKS_WIDTH: number = 56//32//40//64;
	private SPRITE_BLOCKS_HEIGHT: number = 30//30;
	private container: any;

	constructor(props: IChuckieEggProps) {
		super(props);

		this.state = {
			spriteWidth: 0,
			spriteHeight: 0,
			containerWidth: 800,
			containerHeight: 800,
			containerMargin: 0,
			timerInterval: 1000,
		}

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.styleContainer = this.styleContainer.bind(this);
	}

	public async componentDidMount() {
		this.updatePlayerArea();
		window.addEventListener('resize', this.updatePlayerArea);
		window.addEventListener('keydown', this.handleKeyDown);
	}

	public async componentWillUnmount() {
		await this.stopTimer();
		window.removeEventListener('resize', this.updatePlayerArea);
		window.removeEventListener('keydown', this.handleKeyDown);
	}

	public render() {
		return <div className="chuckie-egg-play-container" ref={(d) => { this.container = d }} style={ this.styleContainer() }>

			{ (!this.state.game || !this.state.game.isGameInPlay) && <InfoBoard startGame={ this.startGame } containerHeight={ this.state.containerHeight } /> }

			{ this.state.game && <div>
				<div className="play-area">
					{ this.state.game.board.sprites.map((sprite: ISprite) => <DrawSprite key={ sprite.key } onMouseOver={ this.onMouseOver } onContextMenu={ this.onContextMenu } onClick={ this.onClick } sprite={ sprite } height={ this.state.spriteHeight } width={ this.state.spriteWidth } containerWidth={ this.state.containerWidth } />) }
				</div>
			</div> }
			
		</div>
	}

	private styleContainer = () => ({
		maxWidth: `${ this.state.containerHeight }px`,
		marginLeft: `${ this.state.containerMargin }px`
	})

	private startGame = async (): Promise<void> => {
		const game = new Game(this.props);
		game.isGameInPlay = true;
		await this.startTimer();
		await this.setState(() => ({ game }));
		this.updatePlayerArea();
	}

	private updatePlayerArea = (): void => {
		const containerHeight = this.container && this.container.getBoundingClientRect().height;
		let containerWidth = this.container && this.container.getBoundingClientRect().width;
		const containerMargin = (window.innerWidth - containerWidth) / 2;
		if (containerWidth > containerHeight) containerWidth = containerHeight;
		const spriteWidth = containerWidth / this.SPRITE_BLOCKS_WIDTH;
		const spriteHeight = ((containerWidth / 100) * 100 ) / this.SPRITE_BLOCKS_HEIGHT;
		this.setState(() => ({ spriteWidth, spriteHeight, containerWidth, containerHeight, containerMargin }))
	}

	private handleInput = async (input: PlayerResultEnum, key?: string): Promise<void> => {
		if (!this.state.game) return;

		const game = this.state.game;
		game.handleInput(input, key);

		if (!game.isGameInPlay) this.stopTimer();
		await this.setState(() => ({ game }));
	}

	private handleKeyDown = async (event: any): Promise<void> => {
		if (!this.state.game || !this.state.game.isGameInPlay) return;

		await this.handleInput(event.keyCode);
	}

	private startTimer = async (): Promise<void> => {
		const timer = setInterval(this.myTimer, this.state.timerInterval);

		await this.setState(() => ({ timer }));
	}

	private stopTimer = async (): Promise<void> => {
		clearInterval(this.state.timer);

		await this.setState(() => ({ timer: undefined }));
	}

	private myTimer = (): void => {
		if (!this.state.game) return;
		const game = this.state.game

		this.setState(prev => ({ game }));
	}

	private onMouseOver = (event: any) => {};
	private onContextMenu = (event: any) => {};
	private onClick = (event: any) => {};
}
