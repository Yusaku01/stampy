import {
  createStampyProject,
  installStampyAnimations,
  pressStamp,
  registerStampyElements,
} from "@stampy/core";
import "@stampy/core/styles.css";
import "./styles.css";

registerStampyElements();
installStampyAnimations();

const project = createStampyProject({
  name: "Example passport stamp",
  locale: "en",
  theme: "auto",
  stamp: {
    mainText: "Visited",
    subText: "Local Guide",
    dateText: "2026.06.27",
    shape: "ticket",
    icon: "star",
    ink: "#1b6c86",
    paper: "#fffaf4",
    rotate: -3,
  },
  animation: {
    preset: "bounce",
    durationMs: 820,
    intensity: 1,
  },
});

const stamp = document.querySelector("stampy-mark");

if (stamp) {
  stamp.setAttribute("main-text", project.stamp.mainText);
  stamp.setAttribute("sub-text", project.stamp.subText);
  stamp.setAttribute("date-text", project.stamp.dateText);
  stamp.setAttribute("shape", project.stamp.shape);
  stamp.setAttribute("icon", project.stamp.icon);
  stamp.setAttribute("ink", project.stamp.ink);
  stamp.setAttribute("paper", project.stamp.paper);
  stamp.setAttribute("distress", String(project.stamp.distress));
  stamp.setAttribute("roughen", String(project.stamp.roughen));
  stamp.setAttribute("rotate", String(project.stamp.rotate));
}

document.addEventListener("click", async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    "button[data-action]",
  );
  if (!button) return;

  if (button.dataset.action === "press-classic") {
    await pressStamp(stamp, project.animation);
  }

  if (button.dataset.action === "press-custom") {
    await pressStamp(stamp, {
      durationMs: 900,
      preset: "classic",
      animator: async (element, context) => {
        const animation = element.animate(
          [
            {
              opacity: 0,
              transform: "translateY(-48px) scale(1.55) rotate(-12deg)",
            },
            {
              opacity: 1,
              transform: "translateY(0) scale(1) rotate(-3deg)",
            },
          ],
          {
            duration: context.durationMs,
            easing: "cubic-bezier(.18,.86,.2,1)",
            fill: "both",
          },
        );

        await animation.finished;
      },
    });
  }
});
