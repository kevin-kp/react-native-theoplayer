import React, { useEffect, useRef } from 'react';
import type { THEOplayerViewProps } from 'react-native-theoplayer';
import * as THEOplayer from 'theoplayer';
import { THEOplayerWebAdapter } from './adapter/THEOplayerWebAdapter';

export function THEOplayerView(props: THEOplayerViewProps) {
  const { config } = props;
  const player = useRef<THEOplayer.ChromelessPlayer | null>(null);
  const adapter = useRef<THEOplayerWebAdapter | null>(null);
  const container = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    // Create player inside container.
    if (container.current) {
      const chromeless = config?.chromeless === true || config?.chromeless === undefined;
      if (chromeless) {
        player.current = new THEOplayer.ChromelessPlayer(container.current, config);
      } else {
        player.current = new THEOplayer.Player(container.current, {
          ...config,
          ui: {
            fluid: true,
          },
          allowNativeFullscreen: true,
        } as THEOplayer.PlayerConfiguration);
      }

      // Prepare the player to ChromelessPlayer.autoplay on platforms where autoplay is restricted without user action.
      player.current.prepareWithUserAction();

      // Adapt native player to react-native player.
      adapter.current = new THEOplayerWebAdapter(player.current);

      // Expose players for easy access
      // @ts-ignore
      window.player = adapter.current;

      // @ts-ignore
      window.nativePlayer = player;

      // Notify the player is ready
      props.onPlayerReady?.(adapter.current);
    }

    // Clean-up
    return () => {
      adapter?.current?.destroy();
      player?.current?.destroy();
    };
  }, [container]);

  const chromeless = config?.chromeless === undefined || config?.chromeless === true;
  return (
    <div ref={container} style={styles.container} className={chromeless ? 'theoplayer-container' : 'theoplayer-container video-js theoplayer-skin'} />
  );
}

const styles = {
  // by default stretch the video to cover the container.
  // Override using the 'theoplayer-container' class.
  container: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
  } as React.CSSProperties,
};
