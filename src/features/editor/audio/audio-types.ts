export interface AudioTrackControl {
  trackId: string;
  name: string;
  volume: number; // 0-200
  muted: boolean;
  solo: boolean;
}

export interface AudioMixerState {
  tracks: AudioTrackControl[];
  masterVolume: number; // 0-200
}
