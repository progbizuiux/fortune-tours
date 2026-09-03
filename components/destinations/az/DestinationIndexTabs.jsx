"use client";

import { useState } from "react";
import { FrameButton } from "@/components/common/FrameButton";

/* The two-view switch, and the only client code on /destinations/a-z.
 *
 * Both panels arrive already rendered, as `panel` nodes on each tab. The
 * server builds them and this component only chooses which one is shown, so
 * nothing about 259 links is re-rendered on a click and none of that markup
 * ships as JavaScript — the same slot trick AnimateIn documents for scroll
 * reveals inside server components.
 *
 * The inactive panel is `hidden`, never unmounted. On an index page that is
 * the point rather than an optimisation: every link stays in the served HTML
 * for a crawler and for a visitor whose JavaScript never ran, and the letter
 * rail's anchors keep working because their targets are in the document.
 *
 * State is local. /search puts its filters in the URL because the server
 * re-renders results from them; here both panels are already in the DOM, so a
 * router push would buy a navigation and nothing else.
 */

const tabId = (key) => `destination-index-tab-${key}`;
const panelId = (key) => `destination-index-panel-${key}`;

export function DestinationIndexTabs({ tabs, label, className }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);

  /* Which tabs have ever been opened — the gate on `tab.lead`.
   *
   * A `lead` is the heavy, purely visual thing a panel opens with: today the
   * By Region globe, which pulls in three and a GLB. Its links are NOT in
   * there — those live in `panel`, which is always rendered — so deferring it
   * costs nothing in crawlability and saves every reader who never opens that
   * tab the download.
   *
   * Once opened it STAYS mounted, rather than unmounting on the way back to
   * A to Z. Tearing down a WebGL canvas and rebuilding it on every toggle
   * would rebuild the scene each time, and browsers cap how many contexts a
   * page may create. Hidden is cheap here: the canvas gates its own render
   * loop on an IntersectionObserver, so a hidden panel draws no frames. */
  const [opened, setOpened] = useState(() => new Set([tabs[0]?.key]));

  const open = (key) => {
    setActiveKey(key);
    setOpened((seen) => (seen.has(key) ? seen : new Set(seen).add(key)));
  };

  if (!tabs.length) return null;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === activeKey),
  );

  /* Roving focus. `role="tab"` promises arrow-key navigation, and a tablist
     that does not deliver it is worse than plain buttons — so `tabIndex` makes
     the pair a single Tab stop and the arrows move between them.
   
   * Focus is taken by id rather than through a ref: the ids already exist for
   * aria-controls, and FrameButton does not forward a ref, so this is the one
   * way to move focus without reaching into the shared control. rAF first,
   * because the state change has to paint before the tab it moves to can take
   * focus — the same idiom the navbar's Destinations menu uses to hand focus
   * into a country column. */
  function onKeyDown(event) {
    const last = tabs.length - 1;
    let next = null;

    if (event.key === "ArrowRight") next = Math.min(activeIndex + 1, last);
    else if (event.key === "ArrowLeft") next = Math.max(activeIndex - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    const key = tabs[next].key;
    open(key);
    requestAnimationFrame(() => document.getElementById(tabId(key))?.focus());
  }

  return (
    <div className={className}>
      {/* No rule above the tabs. The packages page seats its tab row on a
          full-width hairline, but that frame closes a centred heading block;
          here the masthead is left-flush and the line only added a second
          horizontal rule a few pixels above the letter rail's own. The tabs
          keep their vertical rules, which is what still reads them as one
          segmented control. */}
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex items-stretch"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <FrameButton
              key={tab.key}
              variant="segment"
              active={isActive}
              role="tab"
              id={tabId(tab.key)}
              aria-selected={isActive}
              aria-controls={panelId(tab.key)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => open(tab.key)}
            >
              {tab.label}
            </FrameButton>
          );
        })}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={panelId(tab.key)}
          aria-labelledby={tabId(tab.key)}
          hidden={index !== activeIndex}
          className="mt-9 lg:mt-[50px]"
        >
          {opened.has(tab.key) && tab.lead}
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
