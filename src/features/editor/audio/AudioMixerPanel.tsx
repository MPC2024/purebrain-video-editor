'use client';

import { useState } from 'react';
import { Volume2, Volume, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AudioTrackControl } from './audio-types';

interface AudioMixerPanelProps {
  onTrackUpdate?: (track: AudioTrackControl) => void;
  onMasterVolumeChange?: (volume: number) => void;
}

const AudioMixerPanel = ({
  onTrackUpdate,
  onMasterVolumeChange,
}: AudioMixerPanelProps) => {
  const [masterVolume, setMasterVolume] = useState<number>(100);
  const [tracks, setTracks] = useState<AudioTrackControl[]>([
    {
      trackId: 'video-audio',
      name: 'Video Audio',
      volume: 100,
      muted: false,
      solo: false,
    },
    {
      trackId: 'background-music',
      name: 'Background Music',
      volume: 80,
      muted: false,
      solo: false,
    },
    {
      trackId: 'voiceover',
      name: 'Voice Over',
      volume: 100,
      muted: false,
      solo: false,
    },
  ]);

  const handleTrackVolumeChange = (trackId: string, newVolume: number) => {
    const updatedTracks = tracks.map((track) =>
      track.trackId === trackId ? { ...track, volume: newVolume } : track,
    );
    setTracks(updatedTracks);

    const track = updatedTracks.find((t) => t.trackId === trackId);
    if (track) {
      onTrackUpdate?.(track);
    }
  };

  const handleToggleMute = (trackId: string) => {
    const updatedTracks = tracks.map((track) =>
      track.trackId === trackId ? { ...track, muted: !track.muted } : track,
    );
    setTracks(updatedTracks);

    const track = updatedTracks.find((t) => t.trackId === trackId);
    if (track) {
      onTrackUpdate?.(track);
    }
  };

  const handleToggleSolo = (trackId: string) => {
    const updatedTracks = tracks.map((track) =>
      track.trackId === trackId
        ? { ...track, solo: !track.solo }
        : { ...track, solo: false },
    );
    setTracks(updatedTracks);

    const track = updatedTracks.find((t) => t.trackId === trackId);
    if (track) {
      onTrackUpdate?.(track);
    }
  };

  const handleMasterVolumeChange = (newVolume: number) => {
    setMasterVolume(newVolume);
    onMasterVolumeChange?.(newVolume);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Master Volume */}
      <div className="space-y-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Master Volume</span>
          </div>
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {masterVolume}%
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <Slider
            value={[masterVolume]}
            onValueChange={(val) => handleMasterVolumeChange(val[0])}
            min={0}
            max={200}
            step={1}
            className="flex-1"
          />
        </div>

        {/* Level Meter */}
        <div className="flex items-center gap-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
            style={{
              width: `${Math.min(masterVolume / 2, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Audio Tracks */}
      <div className="space-y-4">
        {tracks.map((track) => (
          <div
            key={track.trackId}
            className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{track.name}</span>
              <span className="text-xs font-mono bg-background px-2 py-1 rounded">
                {track.volume}%
              </span>
            </div>

            {/* Track Controls */}
            <div className="flex gap-2">
              <Slider
                value={[track.volume]}
                onValueChange={(val) =>
                  handleTrackVolumeChange(track.trackId, val[0])
                }
                min={0}
                max={200}
                step={1}
                className="flex-1"
              />
            </div>

            {/* Mute/Solo Buttons */}
            <div className="flex gap-2">
              <Button
                variant={track.muted ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToggleMute(track.trackId)}
                className="flex-1 h-8"
              >
                {track.muted ? (
                  <>
                    <VolumeX size={14} className="mr-1" />
                    Muted
                  </>
                ) : (
                  <>
                    <Volume size={14} className="mr-1" />
                    Active
                  </>
                )}
              </Button>

              <Button
                variant={track.solo ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToggleSolo(track.trackId)}
                className="flex-1 h-8"
              >
                {track.solo ? 'Solo On' : 'Solo'}
              </Button>
            </div>

            {/* Level Meter */}
            <div className="flex items-center gap-2 h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                style={{
                  width: `${(track.volume / 200) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioMixerPanel;
