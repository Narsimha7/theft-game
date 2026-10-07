class SoundService {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.08) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    this.playTone(600, 0.05, 'sine', 0.04);
  }

  playSelect() {
    this.playTone(740, 0.08, 'triangle', 0.06);
  }

  playTick() {
    this.playTone(900, 0.03, 'sine', 0.03);
  }

  playAlarm() {
    this.playTone(400, 0.15, 'sawtooth', 0.08);
  }

  playSuccess() {
    this.playTone(523.25, 0.1, 'sine', 0.07);
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.07), 100);
  }

  playArrest() {
    this.playTone(320, 0.2, 'square', 0.09);
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) this.playSuccess();
    return this.enabled;
  }
}

export const soundService = new SoundService();
