// Synthesized acoustic sound engine using Web Audio API
// Provides pentatonic chimes, tactile seal thuds, bamboo taps, and ambient water ripples.

const PENTATONIC_FREQS = [
  293.66, // D4
  329.63, // E4
  369.99, // F#4
  440.00, // A4
  493.88, // B4
  587.33, // D5
  659.25, // E5
  739.99, // F#5
  880.00, // A5
  987.77, // B5
  1174.66, // D6
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private enabled = true;
  private entranceTimers: number[] = [];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(4, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

      // Gentle gallery spatial echo
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.22, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(compressor);

      this.masterGain.connect(compressor);
      this.masterGain.connect(this.delayNode);
      compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    if (!next) {
      this.clearEntranceTimers();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public unlock(): boolean {
    const ctx = this.ensureContext();
    return Boolean(ctx && ctx.state === 'running');
  }

  private clearEntranceTimers(): void {
    this.entranceTimers.forEach((id) => window.clearTimeout(id));
    this.entranceTimers = [];
  }

  /**
   * Plays a warm plucked guzheng/celesta pentatonic note for a clicked character
   */
  public playGlyphNote(index: number, total = 13): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const freq = PENTATONIC_FREQS[index % PENTATONIC_FREQS.length];

    // Subtle stereo panning based on character position
    const panner = ctx.createStereoPanner();
    const pan = total > 1 ? ((index / (total - 1)) * 2 - 1) * 0.45 : 0;
    panner.pan.setValueAtTime(pan, now);

    // Filter envelope for warm acoustic pluck
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.9);

    const oscFundamental = ctx.createOscillator();
    oscFundamental.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, now);

    const oscHarmonic = ctx.createOscillator();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.18, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.24, now + 0.014);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 1.45);

    oscFundamental.connect(filter);
    oscHarmonic.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(env);
    env.connect(panner);
    panner.connect(this.masterGain);

    oscFundamental.start(now);
    oscHarmonic.start(now);
    oscFundamental.stop(now + 1.5);
    oscHarmonic.stop(now + 0.5);
  }

  /**
   * Choreographed pentatonic entrance arpeggio synced with glyph reveal
   */
  public playEntranceSequence(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.clearEntranceTimers();
    const sequence = [0, 1, 3, 4, 5, 7, 8, 10];
    sequence.forEach((noteIdx, step) => {
      const timer = window.setTimeout(() => {
        if (this.enabled) {
          this.playGlyphNote(noteIdx, sequence.length);
        }
      }, 160 + step * 155);
      this.entranceTimers.push(timer);
    });
  }

  /**
   * Tactile vermilion ink-seal stamp sound: soft paper thump + jade chime
   */
  public playSealStamp(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    // 1. Soft tactile paper thud
    const thumpOsc = ctx.createOscillator();
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(145, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(46, now + 0.11);

    const thumpEnv = ctx.createGain();
    thumpEnv.gain.setValueAtTime(0.32, now);
    thumpEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    thumpOsc.connect(thumpEnv);
    thumpEnv.connect(this.masterGain);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.16);

    // 2. Warm resonant fifth chord (D5 + A5)
    [587.33, 880.0].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.03);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, now + 0.03);
      env.gain.linearRampToValueAtTime(i === 0 ? 0.14 : 0.1, now + 0.05);
      env.gain.exponentialRampToValueAtTime(0.0008, now + 1.2);

      osc.connect(env);
      env.connect(this.masterGain!);
      osc.start(now + 0.03);
      osc.stop(now + 1.25);
    });
  }

  /**
   * Crisp bamboo/woodblock tap when switching typography styles or orientation
   */
  public playStyleSwitch(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(2.5, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.2, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Subtle water-ink droplet chime when clicking ambient paper canvas
   */
  public playWaterRipple(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const baseFreq = 520 + Math.random() * 140;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.48, now + 0.065);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.09, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.42);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.45);
  }
}

export const soundEngine = new SoundEngine();
