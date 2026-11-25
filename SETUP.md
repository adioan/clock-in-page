# Clock In Page: how to run it

- Live page: https://adioan.github.io/clock-in-page/
- Code: https://github.com/adioan/clock-in-page
- Default admin PIN: 1234

## 1. Load on a new tablet

1. Open **Chrome from the app drawer** on the tablet. Do not tap a link from an email or a chat app: those open a cut-down tab with no install option.
2. Type `adioan.github.io/clock-in-page` in the address bar, press Enter, and let it load fully.
3. Install it, in this order of preference:
   - tap the small **install icon** at the right end of the address bar, or the banner offering to add the page;
   - or open the three-dot menu and choose **Install app** or **Add to Home screen**.
4. If neither appears, it still works: bookmark the page (menu, star), then drag the bookmark onto the home screen from the launcher. The install is cosmetic, the offline caching is not.
5. Check that Desktop site is off in the menu, since it hides the install option.

## 2. Prove the offline part works

Do this once on every tablet, before the group relies on it.

1. Open the page while online and leave it a few seconds so the service worker installs.
2. Turn on **airplane mode**.
3. Close Chrome completely (swipe it out of the recent apps).
4. Open the page again.

If it loads with no signal, the tablet is ready. If it does not, open it once more with signal, wait, and repeat.

## 3. Daily use

- The list shows everyone. Tap a name or its big button to clock in; the button turns green and shows the time. Tap again to clock out.
- **Add new name** next to the search box adds someone without going into admin.
- Admin is the small underlined link at the top left, PIN `1234` to start with. There you can change the clock name, add, edit and remove people, change the PIN, and delete everything.
- Change the PIN from the default on a device that the group will use.

## 4. The hours

- Admin, Export, choose a period (All time, Today, Past 7 days, Past 30 days, This year), then Export Excel.
- Three sheets: Timesheet, Summary, All entries. Hours are live formulas, rounded to the nearest quarter hour, so 2h34m reads 2.5 and 1h08m reads 1.25.
- **Export regularly.** Names and hours live in the tablet's browser, not online, and not in GitHub. Clearing the browser data deletes them.

## 5. Updating the app

The page updates itself. Nothing needs doing on the tablet.

How it works:

- When the page is opened and there is a connection, the service worker fetches a fresh copy in the background and stores it. The next open shows the new version.
- While the page is left open all day, it also checks once an hour and reloads itself when a newer version exists.
- With no connection nothing is fetched: the stored copy keeps working exactly as before.
- The recorded hours are kept in the tablet's own storage, keyed by the site address, so replacing the page never touches them. This only holds while the address stays `https://adioan.github.io/clock-in-page/`.

To publish a change:

1. Replace `index.html` in the GitHub repo (Add file, Upload files, drag it in, Commit changes).
2. Bump the version line near the top of `index.html`: `var APP_VERSION = '2026-11-25.1'` becomes `'2026-11-25.2'`, and so on. Without this the tablets have no way to tell that anything changed.
3. If `sw.js` itself changed, also bump `const CACHE = 'clock-in-page-v1'` to `v2`.
4. Wait about a minute for GitHub Pages, then open the page twice on the tablet, or wait for the hourly check.

## 6. If a tablet looks stuck on an old version

In order, strongest last:

1. Close the tab, reopen the page.
2. Pull down to refresh, or hold the reload button and choose a hard reload.
3. Check the version: the file on GitHub has `APP_VERSION` near the top; if the tablet still behaves old after two opens, wait for the hourly check.
4. Only as a last resort, clear the site data for that address. That deletes the names and the hours, so export first.

## 7. If something breaks

- **Empty list on a tablet**: it is a different address, or the browser data was cleared. There is no import, so names have to be added again.
- **The page will not load offline**: it was never opened while online on that tablet, or the browser data was cleared. Open it once with signal.
- **Forgotten PIN**: it is stored in the browser, not in the code, so there is no reset. Clearing site data resets to 1234 but also deletes the records, so export first if the data matters.
- **A name was removed by mistake**: punches already recorded stay in the export, the name can be re-added.

## 8. Never do this

- Do not commit an exported timesheet to the repo. It contains real names and hours.
- Do not change the storage key `timeclock.v1` in `index.html`. Doing so would make every tablet look empty.
- Do not move the page to a different address without expecting an empty list on every device.

## Files in the repo

| File | What it is |
| --- | --- |
| `index.html` | The whole app in one file |
| `sw.js` | Service worker: offline copy and background update |
| `manifest.webmanifest` | Name, colours, icon for the install prompt |
| `icon.svg` | The icon |
| `SETUP.md` | This document |
| `README.md` | Short public description |
