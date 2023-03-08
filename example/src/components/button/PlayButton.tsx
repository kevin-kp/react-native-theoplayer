import { ActionButton } from './actionbutton/ActionButton';
import type { StyleProp, ViewStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { PlaySvg } from './svg/PlaySvg';

import { PauseSvg } from './svg/PauseSvg';

interface PlayButtonProps {
  style?: StyleProp<ViewStyle>;
}

interface PlayButtonState {
  paused: boolean;
}

export class PlayButton extends PureComponent<PlayButtonProps, PlayButtonState> {
  constructor(props: PlayButtonProps) {
    super(props);
    this.state = {
      paused: true,
    };
  }

  componentDidMount() {
    const context = this.context as UiContext;
    context.player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.setState({
      paused: context.player.paused,
    });
  }

  componentWillUnmount() {
    const context = this.context as UiContext;
    context.player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  private onPlay = () => {
    this.setState({ paused: false });
  };

  private onPause = () => {
    this.setState({ paused: true });
  };

  private onSourceChange = () => {
    const player = (this.context as UiContext).player;
    this.setState({
      paused: player.paused,
    });
  };

  private togglePlayPause = () => {
    const player = (this.context as UiContext).player;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  render() {
    const { paused } = this.state;
    const { style } = this.props;

    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            style={context.style.controlBar.buttonIcon}
            touchable={true}
            svg={paused ? <PlaySvg /> : <PauseSvg />}
            // @ts-ignore
            iconStyle={[style]}
            onPress={this.togglePlayPause}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

PlayButton.contextType = PlayerContext;
