window.__ModuleLoader__.load({
  id: '@zknyy/dsh-session-highlight',
  factory(require) {
    // The active session row renders its title as the 2nd direct child span of the
    // `role="treeitem"` div. No slot exposes the title text, so this plugin targets
    // the shipped DOM through stable structural/ARIA selectors instead of a slot.
    const TITLE_SELECTOR =
      '[role="treeitem"][aria-selected="true"][data-row-key^="session:"] > span:nth-child(2)';

    const CSS = `
      @keyframes dsh-session-highlight-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      ${TITLE_SELECTOR} {
        background-image: linear-gradient(
          270deg,
          #ff512f, #dd2476, #ff512f, #f09819, #ffd200, #3ca55c, #36d1dc, #667eea, #ff512f
        );
        background-size: 200% 100%;
        animation: dsh-session-highlight-flow 4s linear infinite;
      }
      @supports ((-webkit-background-clip: text) or (background-clip: text)) {
        ${TITLE_SELECTOR} {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        ${TITLE_SELECTOR} {
          animation: none;
        }
      }
    `;

    // Marquee tuning. Range/speed mirror the shipped hover marquee so the reveal
    // feels native, but the plugin drives it continuously (ping-pong) instead of
    // only on hover.
    const MIN_REVEAL_PX = 8;
    const PX_PER_MS = 0.05;
    const HOLD_MS = 1500;

    function placeTitle(title, left, range) {
      if (typeof title.scrollTo === 'function') {
        title.scrollTo({ left, behavior: 'instant' });
      } else {
        title.scrollLeft = left;
      }
      if (left > 0) title.dataset.scrolled = '';
      else delete title.dataset.scrolled;
      if (left < range) title.dataset.clipped = '';
      else delete title.dataset.clipped;
    }

    function restTitle(title) {
      placeTitle(title, 0, 0);
    }

    function startMarquee() {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      let raf = 0;
      let title = null;
      let wasHovered = false;
      // ping-pong states: forward -> hold-end -> backward -> hold-start -> forward
      let state = 'forward';
      let position = 0;
      let holdUntil = 0;
      let last = 0;

      function tick(now) {
        raf = window.requestAnimationFrame(tick);

        const el = document.querySelector(TITLE_SELECTOR);
        if (el !== title) {
          title = el;
          state = 'forward';
          position = 0;
          holdUntil = 0;
          last = now;
        }
        if (title === null) return;

        const row = title.closest('[role="treeitem"]');
        const hovered = !!(row && row.matches(':hover'));
        if (hovered !== wasHovered) {
          wasHovered = hovered;
          if (!hovered) {
            // The built-in hover marquee reset scrollLeft to 0 on pointer-leave;
            // resync so our continuous loop resumes without a jump.
            position = title.scrollLeft;
            state = 'forward';
            holdUntil = 0;
          }
        }
        if (hovered) {
          // Defer to the built-in hover marquee while the pointer rests on the row.
          last = now;
          return;
        }

        if (reduced.matches) {
          if (title.scrollLeft !== 0) restTitle(title);
          last = now;
          return;
        }

        const range = title.scrollWidth - title.clientWidth;
        if (range <= MIN_REVEAL_PX) {
          if (title.scrollLeft !== 0) restTitle(title);
          last = now;
          return;
        }

        const dt = now - last;
        last = now;

        switch (state) {
          case 'forward':
            position += PX_PER_MS * dt;
            if (position >= range) {
              position = range;
              state = 'hold-end';
              holdUntil = now + HOLD_MS;
            }
            break;
          case 'hold-end':
            if (now >= holdUntil) state = 'backward';
            break;
          case 'backward':
            position -= PX_PER_MS * dt;
            if (position <= 0) {
              position = 0;
              state = 'hold-start';
              holdUntil = now + HOLD_MS;
            }
            break;
          case 'hold-start':
            if (now >= holdUntil) state = 'forward';
            break;
        }

        placeTitle(title, position, range);
      }

      raf = window.requestAnimationFrame(tick);
      return () => window.cancelAnimationFrame(raf);
    }

    return {
      inject: [],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.setAttribute('data-session-highlight', '');
          style.textContent = CSS;
          document.head.appendChild(style);
          const stop = startMarquee();
          return () => {
            stop();
            style.remove();
          };
        });
      },
    };
  },
});
