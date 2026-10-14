#!/usr/bin/env python3
"""
Procedural audio generator for charity: water Water Quest.
Generates clean, lightweight WAV sound effects for item collection and winning.
Released under the Creative Commons Zero (CC0 1.0 Universal) Public Domain Dedication.
"""

import os
import math
import struct
import wave

def generate_collect_sound(filepath):
    """Generate a crisp, cheerful water-drop / bubble collect sound."""
    sample_rate = 44100
    duration = 0.18
    num_samples = int(sample_rate * duration)
    with wave.open(filepath, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        data = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            # Pitch sweep upward from 450 Hz to 900 Hz (water drop bloop effect)
            freq = 450 + (900 - 450) * (t / duration) ** 0.5
            # Rapid attack, smooth exponential decay envelope
            envelope = math.exp(-t * 18.0) * (1.0 - math.exp(-t * 200.0))
            # Fundamental sine tone with soft 2nd harmonic
            sample = 0.8 * math.sin(2 * math.pi * freq * t) + 0.2 * math.sin(4 * math.pi * freq * t)
            val = int(sample * envelope * 28000)
            data.extend(struct.pack('<h', max(-32768, min(32767, val))))
        wav.writeframes(data)

def generate_win_sound(filepath):
    """Generate a celebratory 4-note ascending fanfare chime (C5, E5, G5, C6)."""
    sample_rate = 44100
    notes = [523.25, 659.25, 783.99, 1046.50]  # C5, E5, G5, C6
    note_duration = 0.22
    total_duration = 1.3
    num_samples = int(sample_rate * total_duration)
    with wave.open(filepath, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        data = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            val = 0.0
            for idx, freq in enumerate(notes):
                note_start = idx * note_duration
                if t >= note_start:
                    note_t = t - note_start
                    # Bell-like chime envelope
                    env = math.exp(-note_t * 4.5) * (1.0 - math.exp(-note_t * 150.0))
                    # Warm bell harmonics
                    harmonic = (math.sin(2 * math.pi * freq * note_t) * 0.7 +
                                math.sin(4 * math.pi * freq * note_t) * 0.25 +
                                math.sin(6 * math.pi * freq * note_t) * 0.05)
                    val += harmonic * env
            int_val = int(max(-1.0, min(1.0, val * 0.6)) * 28000)
            data.extend(struct.pack('<h', int_val))
        wav.writeframes(data)

def main():
    os.makedirs('audio', exist_ok=True)
    generate_collect_sound('audio/collect.wav')
    generate_win_sound('audio/win.wav')
    print('Audio files generated successfully in audio/')

if __name__ == '__main__':
    main()

