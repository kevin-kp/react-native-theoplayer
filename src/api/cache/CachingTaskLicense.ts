/**
 * The {@link CachingTask}'s license API.
 *
 * @public
 */
import type { DRMConfiguration } from 'react-native-theoplayer';

export interface CachingTaskLicense {
  /**
   * Renew all the licenses associated with this task.
   *
   * @param drmConfiguration - The DRM configuration used for license renewals. Defaults to the DRM configuration of the original sourceDescription when omitted.
   */
  renew(drmConfiguration?: DRMConfiguration): void;
}
