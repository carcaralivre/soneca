const PRESETS = [1, 5, 10, 15, 30, 60];
const PREFIX = "💤 ";

function setup() {
  browser.alarms.create("check", { periodInMinutes: 0.5 });
  buildMenu();
}
browser.runtime.onInstalled.addListener(setup);
browser.runtime.onStartup.addListener(setup);
browser.storage.onChanged.addListener(buildMenu);

// Every half minute: discard the tabs nobody touched for the chosen time.

browser.alarms.onAlarm.addListener(async () => {
  const { minutes } = await browser.storage.local.get(DEFAULTS);
  const limit = Date.now() - minutes * 60_000;
  const tabs = await browser.tabs.query({ active: false, discarded: false, audible: false, pinned: false, status: "complete" });
  for (const tab of tabs) {
    if (tab.lastAccessed < limit) discard(tab.id);
  }
});

// Toolbar button: left click runs the action chosen in the right-click menu.

browser.action.onClicked.addListener(async tab => {
  const { click } = await browser.storage.local.get(DEFAULTS);
  if (click === "discard-current") discardCurrent(tab);
  else discardOthers(tab);
});

async function buildMenu() {
  const { minutes, click } = await browser.storage.local.get(DEFAULTS);
  await browser.menus.removeAll();
  const item = props => browser.menus.create({ contexts: ["action"], ...props });

  item({ id: "click:discard-current", type: "radio", title: "Clique descarta esta aba", checked: click === "discard-current" });
  item({ id: "click:discard-others", type: "radio", title: "Clique descarta as outras abas da janela", checked: click === "discard-others" });
  item({ id: "separator", type: "separator" });
  item({ id: "minutes", title: "Descartar abas inativas após" });
  for (const m of [...new Set([...PRESETS, minutes])].sort((a, b) => a - b)) {
    item({ id: `minutes:${m}`, parentId: "minutes", type: "radio", title: m === 1 ? "1 minuto" : `${m} minutos`, checked: m === minutes });
  }
}

browser.menus.onClicked.addListener(({ menuItemId }) => {
  const [key, value] = menuItemId.split(":");
  if (value) browser.storage.local.set({ [key]: key === "minutes" ? Number(value) : value });
});

async function otherTabs(tab) {
  return (await browser.tabs.query({ windowId: tab.windowId, hidden: false })).filter(t => t.id !== tab.id);
}

async function discardCurrent(tab) {
  const others = await otherTabs(tab);
  if (!others.length) return;
  const next = others.sort((a, b) => b.lastAccessed - a.lastAccessed)[0];
  await browser.tabs.update(next.id, { active: true });
  await discard(tab.id, { force: true });
}

async function discardOthers(tab) {
  const others = await otherTabs(tab);
  await Promise.all(others.filter(t => !t.discarded && !t.audible && !t.pinned && t.status === "complete").map(t => discard(t.id)));
}

function setTitle(tabId, func, args = []) {
  return browser.scripting.executeScript({ target: { tabId }, func, args });
}

async function discard(tabId, { force = false } = {}) {
  // Prefix the page title so the discarded tab keeps "💤 Title" as its label.
  // Fails silently on privileged pages (about:, AMO…), which are discarded as-is.
  let prefixed = false;
  try {
    const tab = await browser.tabs.get(tabId);
    await setTitle(tabId, (prefix, fallback) => {
      if (!document.title.startsWith(prefix)) document.title = prefix + (document.title || fallback);
    }, [PREFIX, tab.title]);
    prefixed = true;
    await new Promise(r => setTimeout(r, 300));
  } catch {}

  const tab = await browser.tabs.get(tabId).catch(() => null);
  if (!tab) return;
  if (tab.discarded) return;
  // Changed its mind meanwhile (got focus, started playing, got pinned or is
  // loading): leave it alone and take the prefix back.
  if (tab.active || tab.status !== "complete" || (!force && (tab.audible || tab.pinned))) {
    if (prefixed) {
      setTitle(tabId, prefix => {
        if (document.title.startsWith(prefix)) document.title = document.title.slice(prefix.length);
      }, [PREFIX]).catch(() => {});
    }
    return;
  }
  await browser.tabs.discard(tabId);
}
