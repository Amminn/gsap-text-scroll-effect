import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText"; // Import SplitText
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // --- Lenis Smooth Scroll Setup (no changes) ---
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 2200);
  });
  gsap.ticker.lagSmoothing(0);

  // --- Element Selectors (no changes) ---
  const animatedIcons = document.querySelector(".animated-icons");
  const iconElements = document.querySelectorAll(".animated-icon");
  const textSegments = document.querySelectorAll(".text-segment");
  const placeholders = document.querySelectorAll(".placeholder-icon");
  const heroHeader = document.querySelector(".hero-header");
  const heroSection = document.querySelector(".hero");

  const animeTextParagraphs = document.querySelectorAll(".anime-text p");

  // --- NEW: Create SplitText instances for each text segment ---
  // We split the text into characters and hide them initially.
  const splitTexts = [];
  textSegments.forEach((segment) => {
    const split = new SplitText(segment, {
      type: "words,chars", // Split by both words and characters
      autoSplit: true, // Preserve natural line breaks and layout
    });
    splitTexts.push(split);
  });

  const isMobile = window.innerWidth <= 1000;
  const headerIconSize = isMobile ? 30 : 60;
  const currentIconSize = iconElements[0].getBoundingClientRect().width;
  const exactScale = headerIconSize / currentIconSize;

  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      // Initially hide the text segments (will be revealed by character)
      textSegments.forEach((segment) => {
        gsap.set(segment, { opacity: 1 }); // Keep the container visible
      });
      splitTexts.forEach((split) => {
        gsap.set(split.chars, { opacity: 0 }); // But hide the characters
      });

      if (progress <= 0.3) {
        // --- This block remains unchanged ---
        const moveProgress = progress / 0.3;
        const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

        if (progress <= 0.15) {
          const headerProgress = progress / 0.15;
          const headerMoveY = -50 * headerProgress;
          const headerOpacity = 1 - headerProgress;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
            opacity: headerOpacity,
          });
        } else {
          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });
        }

        if (window.duplicateIcons) {
          window.duplicateIcons.forEach((duplicate) => {
            if (duplicate.parentNode) {
              duplicate.parentNode.removeChild(duplicate);
            }
          });
          window.duplicateIcons = null;
        }

        gsap.set(animatedIcons, {
          x: 0,
          y: containerMoveY,
          scale: 1,
          opacity: 1,
        });

        iconElements.forEach((icon, index) => {
          const staggerDelay = index * 0.1;
          const iconStart = staggerDelay;
          const iconEnd = staggerDelay + 0.5;

          const iconProgress = gsap.utils.mapRange(
            iconStart,
            iconEnd,
            0,
            1,
            moveProgress
          );
          const clampedProgress = Math.max(0, Math.min(1, iconProgress));

          const startOffset = -containerMoveY;
          const individualY = startOffset * (1 - clampedProgress);

          gsap.set(icon, {
            x: 0,
            y: individualY,
          });
        });
      } else if (progress <= 0.6) {
        // --- This block remains unchanged ---
        const scaleProgress = (progress - 0.3) / 0.3;

        gsap.set(heroHeader, {
          transform: `translate(-50%, calc(-50% + -50px))`,
          opacity: 0,
        });

        if (scaleProgress >= 0.5) {
          heroSection.style.backgroundColor = "#e3e3db";
        } else {
          heroSection.style.backgroundColor = "#141414";
        }

        if (window.duplicateIcons) {
          window.duplicateIcons.forEach((duplicate) => {
            if (duplicate.parentNode) {
              duplicate.parentNode.removeChild(duplicate);
            }
          });
          window.duplicateIcons = null;
        }

        const targetCenterY = window.innerHeight / 2;
        const targetCenterX = window.innerWidth / 2;
        const containerRect = animatedIcons.getBoundingClientRect();
        const currentCenterX = containerRect.left + containerRect.width / 2;
        const currentCenterY = containerRect.top + containerRect.height / 2;
        const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
        const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
        const baseY = -window.innerHeight * 0.3;
        const currentScale = 1 + (exactScale - 1) * scaleProgress;

        gsap.set(animatedIcons, {
          x: deltaX,
          y: baseY + deltaY,
          scale: currentScale,
          opacity: 1,
        });

        iconElements.forEach((icon) => {
          gsap.set(icon, { x: 0, y: 0 });
        });
      } else if (progress <= 0.75) {
        // --- This block remains unchanged ---
        const moveProgress = (progress - 0.6) / 0.15;

        gsap.set(heroHeader, {
          transform: `translate(-50%, calc(-50% + -50px))`,
          opacity: 0,
        });

        heroSection.style.backgroundColor = "#e3e3db";

        const targetCenterY = window.innerHeight / 2;
        const targetCenterX = window.innerWidth / 2;
        const containerRect = animatedIcons.getBoundingClientRect();
        const currentCenterX = containerRect.left + containerRect.width / 2;
        const currentCenterY = containerRect.top + containerRect.height / 2;
        const deltaX = targetCenterX - currentCenterX;
        const deltaY = targetCenterY - currentCenterY;
        const baseY = -window.innerHeight * 0.3;

        gsap.set(animatedIcons, {
          x: deltaX,
          y: baseY + deltaY,
          scale: exactScale,
          opacity: 0,
        });

        iconElements.forEach((icon) => {
          gsap.set(icon, { x: 0, y: 0 });
        });

        if (!window.duplicateIcons) {
          window.duplicateIcons = [];

          iconElements.forEach((icon, index) => {
            const duplicate = icon.cloneNode(true);
            duplicate.className = "duplicate-icon";
            duplicate.style.position = "absolute";
            duplicate.style.width = headerIconSize + "px";
            duplicate.style.height = headerIconSize + "px";

            document.body.appendChild(duplicate);
            window.duplicateIcons.push(duplicate);
          });
        }

        if (window.duplicateIcons) {
          window.duplicateIcons.forEach((duplicate, index) => {
            if (index < placeholders.length) {
              const iconRect = iconElements[index].getBoundingClientRect();
              const startCenterX = iconRect.left + iconRect.width / 2;
              const startCenterY = iconRect.top + iconRect.height / 2;
              const startPageX = startCenterX + window.pageXOffset;
              const startPageY = startCenterY + window.pageYOffset;

              const targetRect = placeholders[index].getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const targetPageX = targetCenterX + window.pageXOffset;
              const targetPageY = targetCenterY + window.pageYOffset;

              const moveX = targetPageX - startPageX;
              const moveY = targetPageY - startPageY;

              let currentX = 0;
              let currentY = 0;

              if (moveProgress <= 0.5) {
                const verticalProgress = moveProgress / 0.5;
                currentY = moveY * verticalProgress;
              } else {
                const horizontalProgress = (moveProgress - 0.5) / 0.5;
                currentY = moveY;
                currentX = moveX * horizontalProgress;
              }

              const finalPageX = startPageX + currentX;
              const finalPageY = startPageY + currentY;

              duplicate.style.left = finalPageX - headerIconSize / 2 + "px";
              duplicate.style.top = finalPageY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });
        }
      } else {
        // --- MODIFIED: This block handles the letter-by-letter animation ---
        gsap.set(heroHeader, {
          transform: `translate(-50%, calc(-50% + -100px))`,
          opacity: 0,
        });

        heroSection.style.backgroundColor = "#e3e3db";
        gsap.set(animatedIcons, { opacity: 0 });

        if (window.duplicateIcons) {
          window.duplicateIcons.forEach((duplicate, index) => {
            if (index < placeholders.length) {
              const targetRect = placeholders[index].getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const targetPageX = targetCenterX + window.pageXOffset;
              const targetPageY = targetCenterY + window.pageYOffset;

              duplicate.style.left = targetPageX - headerIconSize / 2 + "px";
              duplicate.style.top = targetPageY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });
        }

        // Define the progress range for the entire text animation
        const textAnimationStartProgress = 0.75;
        const textAnimationEndProgress = 1.0;

        // Animate each segment one after the other
        splitTexts.forEach((split, segmentIndex) => {
          const chars = split.chars;
          const numChars = chars.length;

          // Calculate at what scroll progress this specific segment should start and end its animation
          const segmentStart =
            textAnimationStartProgress +
            (segmentIndex / splitTexts.length) *
              (textAnimationEndProgress - textAnimationStartProgress);
          const segmentEnd =
            textAnimationStartProgress +
            ((segmentIndex + 1) / splitTexts.length) *
              (textAnimationEndProgress - textAnimationStartProgress);

          // Determine this segment's local progress based on the overall scroll progress
          const segmentProgress = gsap.utils.mapRange(
            segmentStart,
            segmentEnd,
            0,
            1,
            progress
          );

          // Animate characters within the current segment
          chars.forEach((char, charIndex) => {
            // Stagger the appearance of each character within the segment's animation time
            const charStart = charIndex / numChars;
            const charEnd = (charIndex + 1) / numChars;

            // Map the segment's progress to the character's progress and fade it in
            const charProgress = gsap.utils.mapRange(
              charStart,
              charEnd,
              0,
              1,
              segmentProgress
            );
            const clampedCharProgress = Math.max(0, Math.min(1, charProgress));

            // Opacity goes from 0.1 to 1 instead of 0 to 1
            const minOpacity = 0.1;
            const opacity = minOpacity + (1 - minOpacity) * clampedCharProgress;

            gsap.set(char, { opacity });
          });
        });
      }
    },
  });

  // text scroll animation

  const keywords = ["intuitive", "storytelling", "interactive", "creative"];
  const wordHighlightBgColor = "60, 60, 60";

  console.log(animeTextParagraphs);

  animeTextParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    console.log(words);
    paragraph.innerHTML = "";

    words.forEach((word) => {
      if (word.trim()) {
        console.log(word);
        const wordContainer = document.createElement("div");
        wordContainer.className = "word";

        const wordText = document.createElement("span");
        wordText.textContent = word;

        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        if (keywords.includes(normalizedWord)) {
          wordContainer.classList.add("keyword-wrapper");
          wordText.classList.add("keyword", normalizedWord);
        }
        wordContainer.appendChild(wordText);
        paragraph.appendChild(wordContainer);
      }
    });
  });

  const animeTextContainers = document.querySelectorAll(
    ".anime-text-container"
  );

  animeTextContainers.forEach((container) => {
    ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * 3}`,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(
          container.querySelectorAll(".anime-text .word")
        );
        const totalWords = words.length;
        words.forEach((word, index) => {
          const wordText = word.querySelector("span");

          if (progress <= 1) {
            const progressTarget = 1;
            const revealProgress = Math.min(1, progress / progressTarget);

            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords; // = 1 + 15/100 = 1.15

            const wordStart = index / totalWords; // 0.2
            const wordEnd = wordStart + overlapWords / totalWords; // 0.35

            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
              );

            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;

            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

            word.style.opacity = wordProgress;

            const backgroundFadeStart =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

            const textRevealThreshold = 0.9;
            const textRevealProgress =
              wordProgress >= textRevealThreshold
                ? (wordProgress - textRevealThreshold) /
                  (1 - textRevealThreshold)
                : 0;
            wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
          }
          // else {
          //   const reverseProgress = (progress - 0.7) / 0.3;
          //   word.style.opacity = 1;
          //   const targetTextOpacity = 1;

          //   const reverseOverlapWords = 5;
          //   const reverseWordStart = index / totalWords;
          //   const reverseWordEnd =
          //     reverseWordStart + reverseOverlapWords / totalWords;

          //   const reverseTimelineScale =
          //     1 /
          //     Math.max(
          //       1,
          //       (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
          //     );

          //   const reverseAdjustedStart =
          //     reverseWordStart * reverseTimelineScale;
          //   const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
          //   const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

          //   const reverseWordProgress =
          //     reverseProgress <= reverseAdjustedStart
          //       ? 0
          //       : reverseProgress >= reverseAdjustedEnd
          //       ? 1
          //       : (reverseProgress - reverseAdjustedStart) / reverseDuration;

          //   if (reverseWordProgress > 0) {
          //     wordText.style.opacity =
          //       targetTextOpacity * (1 - reverseWordProgress);
          //     word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
          //   } else {
          //     wordText.style.opacity = targetTextOpacity;
          //     word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
          //   }
          // }
        });
      },
    });
  });
});
