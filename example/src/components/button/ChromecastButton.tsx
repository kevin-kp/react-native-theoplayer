import { CastEvent, CastEventType, CastState, PlayerEventType } from 'react-native-theoplayer';
import React, { PureComponent } from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { ActionButton } from './actionbutton/ActionButton';
import { ChromecastSvg } from './svg/ChromecastSvg';
import { Platform } from 'react-native';

export function isConnected(state: CastState | undefined): boolean {
  return state === 'connecting' || state === 'connected';
}

export interface CastButtonState {
  castState: CastState;
}

export class ChromecastButton extends PureComponent<unknown, CastButtonState> {
  private static initialState: CastButtonState = {
    castState: CastState.unavailable,
  };

  constructor(props: unknown) {
    super(props);
    this.state = ChromecastButton.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
    this.setState({ castState: player.cast.chromecast?.state ?? CastState.unavailable });
    console.log('castState', this.state.castState);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  private onCastStateChangeEvent = (event: CastEvent) => {
    if (event.subType != CastEventType.CHROMECAST_STATE_CHANGE) {
      return;
    }
    console.log('castState', event.state);
    this.setState({ castState: event.state });
  };

  private onPress = () => {
    const player = (this.context as UiContext).player;
    if (isConnected(this.state.castState)) {
      player.cast.chromecast?.stop();
    } else {
      player.cast.chromecast?.start();
    }
  };

  render() {
    const { castState } = this.state;
    // TODO: state is reported as unavailable by Android bridge when it is available.
    if (Platform.OS === 'web' && castState === CastState.unavailable) {
      return <></>;
    }
    return <ActionButton svg={<ChromecastSvg />} touchable={true} onPress={this.onPress} highlighted={isConnected(castState)} />;
  }
}

ChromecastButton.contextType = PlayerContext;
