import { TestScope } from 'cavy';
import { AdDescription, AdEventType, PlayerEventType, SourceDescription, AdEvent } from 'react-native-theoplayer';
import hls from '../res/hls.json';
import ads from '../res/ads.json';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { waitForPlayerEvents, waitForPlayerEventTypes } from '../utils/Actions';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';

function extendSourceWithAds(source: SourceDescription, ad: AdDescription): SourceDescription {
  return { ...source, ads: [ad] };
}

export default function (spec: TestScope) {
  TestSources()
    .withAds()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Set ${testSource.description} and auto-play`, function () {
        spec.it('dispatches sourcechange, play, playing and ad events', async function () {
          const player = await getTestPlayer();
          const playEventsPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

          const adEventsPromise = waitForPlayerEvents(player, [
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BREAK_BEGIN } as AdEvent,
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BEGIN } as AdEvent,
          ]);

          // Start autoplay
          player.autoplay = true;
          player.source = extendSourceWithAds(hls[0], ads[0] as AdDescription);

          // Expect events.
          await playEventsPromise;
          await adEventsPromise;
        });
      });
    });
}
