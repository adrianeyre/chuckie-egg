import React from 'react';

import Game from '../../classes/game';
import ISprite from '../../classes/interfaces/sprite';
import IChuckieEggProps from './interfaces/chuckie-egg-props';
import IChuckieEggState from './interfaces/chuckie-egg-state';
import DrawSprite from '../draw-sprite/draw-sprite';
import InfoBoard from '../info-board/info-board';
import GameStatusTop from '../game-status-top/game-status-top';
import PlayerResultEnum from 'classes/enums/player-result-enum';

import './styles/chuckie-egg.scss';

export default class ChuckieEgg extends React.Component<IChuckieEggProps, IChuckieEggState> {
	private SPRITE_BLOCKS_WIDTH: number = 56;
	private SPRITE_BLOCKS_HEIGHT: number = 30;
	private container: any;

	constructor(props: IChuckieEggProps) {
		super(props);

		this.state = {
			spriteWidth: 0,
			spriteHeight: 0,
			containerWidth: 800,
			containerHeight: 800,
			containerMargin: 0,
			fallTimerInterval: 100,
			jumpTimerInterval: 100,
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
		await this.stopFallTimer();
		await this.stopJumpTimer();
		window.removeEventListener('resize', this.updatePlayerArea);
		window.removeEventListener('keydown', this.handleKeyDown);
	}

	public render() {
		return <div className="chuckie-egg-play-container" ref={(d) => { this.container = d }} style={ this.styleContainer() }>

			{ (!this.state.game || !this.state.game.isGameInPlay) && <InfoBoard startGame={ this.startGame } containerHeight={ this.state.containerHeight } /> }

			{ this.state.game && <div>
				<div className="play-area">
					<div style={ this.styleStatusTop() }><GameStatusTop score={ this.state.game.board.player.score } hiScore={ 10000 } /></div>

					{ this.state.game.board.sprites.map((sprite: ISprite) => <DrawSprite key={ sprite.key } onMouseOver={ this.onMouseOver } onContextMenu={ this.onContextMenu } onClick={ this.onClick } sprite={ sprite } height={ this.state.spriteHeight } width={ this.state.spriteWidth } containerWidth={ this.state.containerWidth } />) }

					<DrawSprite onMouseOver={ this.onMouseOver } onContextMenu={ this.onContextMenu } onClick={ this.onClick } sprite={ this.state.game.board.player } height={ this.state.spriteHeight } width={ this.state.spriteWidth } containerWidth={ this.state.containerWidth } />
				</div>
			</div> }
			
		</div>
	}

	private styleStatusTop = () => ({
		position: 'absolute' as 'absolute',
		width: `100%`,
		maxWidth: `${ this.state.containerHeight }px`,
	})

	private styleContainer = () => ({
		maxWidth: `${ this.state.containerHeight }px`,
		marginLeft: `${ this.state.containerMargin }px`,
	})

	private startGame = async (): Promise<void> => {
		const props = {...this.props, refreshGameState: this.refreshGameState}
		const game = new Game(props);
		game.isGameInPlay = true;
		await this.setState(() => ({ game }));
		this.updatePlayerArea();
	}

	private updatePlayerArea = (): void => {
		const containerHeight = this.container && this.container.getBoundingClientRect().height;
		let containerWidth = this.container && this.container.getBoundingClientRect().width;
		const containerMargin = (window.innerWidth - containerWidth) / 2;
		if (containerWidth > containerHeight) containerWidth = containerHeight;
		const spriteWidth = containerWidth / this.SPRITE_BLOCKS_WIDTH;
		const spriteHeight = ((containerWidth / 100) * 85 ) / this.SPRITE_BLOCKS_HEIGHT;
		this.setState(() => ({ spriteWidth, spriteHeight, containerWidth, containerHeight, containerMargin }))
	}

	private handleInput = async (input: PlayerResultEnum, key?: string): Promise<void> => {
		if (!this.state.game) return;

		const game = this.state.game;
		const result = game.handleInput(input, key);

		if (result === PlayerResultEnum.START_FALL_TIMER) await this.startFallTimer();
		if (result === PlayerResultEnum.START_JUMP_TIMER) await this.startJumpTimer();
		if (!game.isGameInPlay) this.stopFallTimer();

		await this.setState(() => ({ game }));
	}

	private handleKeyDown = async (event: any): Promise<void> => {
		if (!this.state.game || !this.state.game.isGameInPlay) return;

		await this.handleInput(event.keyCode);
	}

	private startFallTimer = async (): Promise<void> => {
		const fallTimer = setInterval(this.myFallTimer, this.state.fallTimerInterval);

		await this.setState(() => ({ fallTimer }));
	}

	private startJumpTimer = async (): Promise<void> => {
		const jumpTimer = setInterval(this.myJumpTimer, this.state.jumpTimerInterval);

		await this.setState(() => ({ jumpTimer }));
	}

	private stopFallTimer = async (): Promise<void> => {
		clearInterval(this.state.fallTimer);

		await this.setState(() => ({ fallTimer: undefined }));
	}

	private stopJumpTimer = async (): Promise<void> => {
		clearInterval(this.state.jumpTimer);

		await this.setState(() => ({ jumpTimer: undefined }));
	}

	private myFallTimer = (): void => {
		if (!this.state.game) return;
		const game = this.state.game
		const result = game.handleFallTimer();

		if (result === PlayerResultEnum.STOP_FALL_TIMER) this.stopFallTimer();

		this.setState(prev => ({ game }));
	}

	private myJumpTimer = (): void => {
		if (!this.state.game) return;
		const game = this.state.game
		const result = game.handleJumpTimer();

		if (result === PlayerResultEnum.STOP_JUMP_TIMER) this.stopJumpTimer();

		this.setState(prev => ({ game }));
	}

	private refreshGameState = async (result: PlayerResultEnum): Promise<void> => {
		const game = this.state.game

		this.setState(prev => ({ game }));
	}

	private onMouseOver = (event: any) => {};
	private onContextMenu = (event: any) => {};
	private onClick = (event: any) => {};
}
