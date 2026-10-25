const input = document.getElementById("minutes");
const radios = document.querySelectorAll('input[name="click"]');

async function load() {
  const { minutes, click } = await browser.storage.local.get(DEFAULTS);
  input.value = minutes;
  for (const r of radios) r.checked = r.value === click;
}
load();
browser.storage.onChanged.addListener(load);

input.addEventListener("change", () => {
  const minutes = Math.max(1, Math.round(Number(input.value)) || DEFAULTS.minutes);
  input.value = minutes;
  browser.storage.local.set({ minutes });
});

for (const r of radios) {
  r.addEventListener("change", () => browser.storage.local.set({ click: r.value }));
}
