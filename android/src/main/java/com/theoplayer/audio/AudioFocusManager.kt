package com.theoplayer.audio

import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.media.AudioManager
import androidx.media.AudioAttributesCompat
import androidx.media.AudioFocusRequestCompat
import androidx.media.AudioManagerCompat
import com.theoplayer.android.api.player.Player

/**
 * Manages audio focus for the application, ensuring proper handling of audio focus changes
 * to control media playback behavior.
 *
 * @param context The context used to access system services.
 * @param player The media player instance associated with this audio focus manager. It can be
 *               provided optionally to control playback behavior.
 */
class AudioFocusManager(
  context: Context,
  private val player: Player? = null
) : AudioManager.OnAudioFocusChangeListener {

  private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
  private val uiModeManager = context.getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager

  private val audioFocusRequest = AudioFocusRequestCompat.Builder(AudioManagerCompat.AUDIOFOCUS_GAIN)
    .setAudioAttributes(
      AudioAttributesCompat.Builder()
        // Usage value to use when the usage is media, such as music, or movie soundtracks.
        .setUsage(AudioAttributesCompat.USAGE_MEDIA)
        // Content type value to use when the content type is a soundtrack, typically accompanying
        // a movie or TV program.
        .setContentType(AudioAttributesCompat.CONTENT_TYPE_MOVIE)
        .build()
    )
    .setOnAudioFocusChangeListener(this)
    .setWillPauseWhenDucked(true)
    .build()

  /**
   * Called on the listener to notify it the audio focus for this listener has been changed.
   */
  override fun onAudioFocusChange(focusChange: Int) {
    if (uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
      // Ignore changes in audioFocus for Connected TVs.
      return
    }
    when (focusChange) {
      // Used to indicate a gain of audio focus, or a request of audio focus, of unknown duration.
      AudioManagerCompat.AUDIOFOCUS_GAIN -> player?.play()

      // Used to indicate a transient loss of audio focus where the loser of the audio focus can
      // lower its output volume if it wants to continue playing (also referred to as "ducking"),
      // as the new focus owner doesn't require others to be silent.
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> player?.pause()
    }
  }

  /**
   * Send a request to obtain the audio focus
   *
   * @return True if audio focus is granted, false otherwise.
   */
  fun retrieveAudioFocus(): Boolean {
    return AudioManager.AUDIOFOCUS_REQUEST_GRANTED == audioManager?.let {
      AudioManagerCompat.requestAudioFocus(it, audioFocusRequest)
    }
  }

  /**
   * Abandon audio focus. Causes the previous focus owner, if any, to receive focus.
   */
  fun abandonAudioFocus() {
    audioManager?.let {
      AudioManagerCompat.abandonAudioFocusRequest(it, audioFocusRequest)
    }
  }
}
