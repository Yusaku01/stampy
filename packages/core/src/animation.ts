export type StampAnimationPreset = "classic" | "bounce" | "ink" | "none";

export type StampPressContext = {
  preset: StampAnimationPreset;
  durationMs: number;
  intensity: number;
};

export type StampAnimator = (
  element: Element,
  context: StampPressContext,
) => void | Promise<void>;

export type StampPressOptions = Partial<StampPressContext> & {
  animator?: StampAnimator;
};

const defaultContext = {
  preset: "classic",
  durationMs: 780,
  intensity: 1,
} satisfies StampPressContext;

let styleInstalled = false;

export const stampyAnimationCss = `@keyframes stampy-classic-press {
  0% { opacity: 0; transform: translateY(-34%) scale(1.7) rotate(-12deg); filter: blur(2px); }
  42% { opacity: 1; transform: translateY(0) scale(0.88) rotate(-6deg); filter: blur(0); }
  62% { transform: translateY(-3%) scale(1.04) rotate(-6deg); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotate(-6deg); }
}

@keyframes stampy-bounce-press {
  0% { opacity: 0; transform: translateY(-22%) scale(0.72) rotate(4deg); }
  55% { opacity: 1; transform: translateY(2%) scale(1.14) rotate(-7deg); }
  78% { transform: translateY(-1%) scale(0.96) rotate(-5deg); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotate(-6deg); }
}

@keyframes stampy-ink-press {
  0% { opacity: 0; transform: scale(1.32) rotate(-10deg); filter: contrast(1.5) saturate(0.4); }
  48% { opacity: 0.52; transform: scale(0.98) rotate(-6deg); }
  100% { opacity: 1; transform: scale(1) rotate(-6deg); filter: contrast(1) saturate(1); }
}

.stampy-is-pressing {
  animation-duration: var(--stampy-press-duration, 780ms);
  animation-timing-function: cubic-bezier(.2,.8,.2,1);
  animation-fill-mode: both;
  transform-origin: center;
}

.stampy-is-pressing[data-stampy-preset="classic"] { animation-name: stampy-classic-press; }
.stampy-is-pressing[data-stampy-preset="bounce"] { animation-name: stampy-bounce-press; }
.stampy-is-pressing[data-stampy-preset="ink"] { animation-name: stampy-ink-press; }

@media (prefers-reduced-motion: reduce) {
  .stampy-is-pressing {
    animation-duration: 1ms;
  }
}`;

export const installStampyAnimations = (root: Document | ShadowRoot = document) => {
  if (styleInstalled && root === document) return;

  const style = document.createElement("style");
  style.dataset.stampyAnimations = "";
  style.textContent = stampyAnimationCss;
  if (root === document) {
    document.head.append(style);
  } else {
    root.append(style);
  }
  if (root === document) styleInstalled = true;
};

export const pressStamp = async (
  element: Element | null | undefined,
  options: StampPressOptions = {},
): Promise<void> => {
  if (!element) return;

  const context = {
    ...defaultContext,
    ...options,
  };

  if (context.preset === "none") {
    return;
  }

  if (options.animator) {
    await options.animator(element, context);
    return;
  }

  installStampyAnimations();
  element.classList.remove("stampy-is-pressing");
  element.setAttribute("data-stampy-preset", context.preset);
  (element as HTMLElement).style.setProperty(
    "--stampy-press-duration",
    `${context.durationMs}ms`,
  );

  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      element.classList.add("stampy-is-pressing");
      window.setTimeout(resolve, context.durationMs);
    });
  });
};
