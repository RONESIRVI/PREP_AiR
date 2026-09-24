// Synthesized gentle bell/chime using Web Audio API (offline & self-contained)

export function playTimerChime(
  type: "focus_end" | "break_end" | "click" = "focus_end"
) {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Ensure context is resumed (for user gesture policies)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
      return;
    }

    // Gentle Tibetan singing bell chord for session completions
    const freqs = type === "focus_end" ? [528, 660, 792] : [440, 554, 659];
    const duration = 1.8;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.15 / (idx + 1), ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + duration + 0.1);
    });
  } catch (err) {
    // Audio might be blocked or unsupported in some sandboxes
    console.debug("Web Audio chime suppressed:", err);
  }
}
