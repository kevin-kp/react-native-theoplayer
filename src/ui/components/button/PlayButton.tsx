import { ActionButton } from './actionbutton/ActionButton';
import type { StyleProp, ViewStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { PlaySvg } from './svg/PlaySvg';

import { PauseSvg } from './svg/PauseSvg';
import { ReplaySvg } from './svg/ReplaySvg';

interface PlayButtonProps {
  /**
   * The style overrides for the play/pause button.
   */
  style?: StyleProp<ViewStyle>;
}

interface PlayButtonState {
  paused: boolean;
  ended: boolean;
}

/**
 * The default play/pause button for the `react-native-theoplayer` UI.
 */
export class PlayButton extends PureComponent<PlayButtonProps, PlayButtonState> {
  constructor(props: PlayButtonProps) {
    super(props);
    this.state = {
      paused: true,
      ended: false,
    };
  }

  componentDidMount() {
    const context = this.context as UiContext;
    context.player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    context.player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    context.player.addEventListener(PlayerEventType.SEEKING, this.onSeeking);
    this.setState({
      paused: context.player.paused,
      ended: context.player.currentTime === context.player.duration,
    });
  }

  componentWillUnmount() {
    const context = this.context as UiContext;
    context.player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    context.player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
    context.player.removeEventListener(PlayerEventType.SEEKING, this.onSeeking);
  }

  private onPlay = () => {
    const player = (this.context as UiContext).player;
    if (player.seeking) {
      return;
    }
    this.setState({ paused: false, ended: false });
  };

  private onPause = () => {
    const player = (this.context as UiContext).player;
    if (player.seeking) {
      return;
    }
    this.setState({ paused: true });
  };

  private onSourceChange = () => {
    const player = (this.context as UiContext).player;
    this.setState({ paused: player.paused });
  };

  private onEnded = () => {
    this.setState({ ended: true });
  };

  private onSeeking = () => {
    this.setState({ ended: false });
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
    const { paused, ended } = this.state;
    const { style } = this.props;

    return (
      <ActionButton style={style} touchable={true} svg={ended ? <ReplaySvg /> : paused ? <PlaySvg /> : <PauseSvg />} onPress={this.togglePlayPause} />
    );
  }
}

PlayButton.contextType = PlayerContext;
