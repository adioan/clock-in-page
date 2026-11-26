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
- The small number next to Admin is the page version, for example `v1.10`. Next to it, a chip says whether the hours have been sent: see section 8.
- Admin is the small underlined link at the top left, PIN `1234` to start with. There you can change the clock name, add, edit and remove people, change the PIN, and delete everything.
- Change the PIN from the default on a device that the group will use.

## 4. The hours

- Admin, Export, choose a period (All time, Today, Past 7 days, Past 30 days, This year), then Export Excel.
- Three sheets: Timesheet, Summary, All entries. Hours are live formulas, rounded to the nearest quarter hour, so 2h34m reads 2.5 and 1h08m reads 1.25.
- From January 2027 the tablet sends the hours to the Google Sheet by itself, and the month tabs add them up. Section 8 covers it.
- **Export regularly.** Until a batch has been sent, the names and hours live only in the tablet's browser. Clearing the browser data deletes them.

## 5. Updating the app

The page updates itself. Nothing needs doing on the tablet.

How it works:

- When the page is opened and there is a connection, the service worker fetches a fresh copy in the background and stores it. The next open shows the new version.
- While the page is left open all day, it also checks once an hour and reloads itself when a newer version exists.
- With no connection nothing is fetched: the stored copy keeps working exactly as before.
- The recorded hours are kept in the tablet's own storage, keyed by the site address, so replacing the page never touches them. This only holds while the address stays `https://adioan.github.io/clock-in-page/`.

To publish a change:

1. Open `index.html` on GitHub, click the pencil, select all, paste the new file, Commit changes. Editing in place works; the upload page does not always.
2. Bump the version line near the top of `index.html`: `var APP_VERSION = '1.00'` becomes `'1.01'`, then `'1.02'` and so on. The number shown next to Admin on every tablet is read from that line, always displayed as x.xx, so it is the one thing to trust when checking whether a device is current.
3. If `sw.js` itself changed, also bump `const CACHE = 'clock-in-page-v3'` to `v4`.
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

## 8. The sheet: sending the hours

From January 2027 the tablet sends its sessions to the 2027 Timesheet by itself, into the `Entries` tab, and the month tabs add them up. The Excel export stays: it is the backup, and the fallback when a send is refused.

**Set it up once per tablet**

1. Open Admin, enter the PIN, then **Settings for sending**.
2. **Endpoint**: the web app URL, `https://script.google.com/macros/s/AKfy.../exec`. It is the same on every tablet.
3. **Secret**: the shared secret, the same on every tablet. It is not in the code. Ask Adi, and keep it in a password manager.
4. **Tablet name**: for example `Tablet 1` or `Kitchen tablet`. It appears in the `device` column of `Entries`, so a wrong tablet is easy to spot.
5. Press **Save settings**, then **Test the connection**. It should answer `Connected. Script version bridge-1, <time>.`

**The send rule**

- The page sends by itself when it has a connection and there is something to send: when it opens, when the connection comes back, and when you press **Send now**.
- A session held for review blocks the send, and the page names it: `Cannot send. Needs review: Ann, 26 Nov.` People still clocked in block nothing.
- Allow 15 seconds. A quiet first call takes about 4 seconds and is not a failure.
- The small chip next to the version is the state: `all sent`, `waiting 3`, `review 1`, `open 2`, `offline`, `auth error`.
- When hours have waited more than 7 days, the Send card shows an amber line. Send soon, and export as a backup.

**Review**

Someone still clocked in at midnight is closed at the end of that day, at 23:59, and **held** rather than sent, because that guessed time is almost certainly wrong.

1. Admin, then **Review**. Each row shows the name, the date, the clock-in and the guessed clock-out.
2. Confirm it as it stands, or set the real times and press **Confirm**. Both times must be on the same day, and the clock-out after the clock-in.
3. **Discard** deletes the session, both its punches. Use it for a clock-in that should never have happened.

A session the script refuses, for example a clock-out on the next day, comes back into Review with its reason and stays out of the Sheet until it is fixed or discarded.

**After a send**

- `2 sessions sent at 16:42.` Good.
- `1 name is not in Overview: X. Fix them in Entries.` The hours are saved, but in no month row. In the Sheet, open `Entries`, correct the red name to match `Overview` exactly, and the hours move by themselves.
- `Auth error`: the secret is wrong or has changed. Settings, type it again.
- `No reply`: the connection. The sessions stay on the tablet. Press Send now again.
- `1 not sent: reason`: open Review.

**One year per sheet**

A session dated outside the year in `Overview!B2` is refused with `not in the 2027 sheet`, because a month tab holds one year only and such a row would total nowhere. Export it, or discard it in Review. Before a rollover, send everything off the tablets first.

**If the deployment is lost**

1. Open the Sheet, **Extensions**, **Apps Script**. The project holds `setupYear` and the `bridge` file. `Code.gs` is also kept in the vault, in `inbox/clock-in-bridge/`.
2. Paste `Code.gs` into the `bridge` file and save.
3. **Project Settings**: time zone London, and Script Properties `SHARED_SECRET`.
4. **Deploy**, **New deployment**, **Web app**, execute as me, access anyone. Copy the new URL.
5. Type the URL into every tablet, then press Test the connection on one.

Every code change needs a new version: Deploy, Manage deployments, edit, version: new. A redeploy publishes whatever the editor holds, so paste first, then deploy.

## 9. Never do this

- Do not commit an exported timesheet to the repo. It contains real names and hours.
- Do not change the storage key `timeclock.v1` in `index.html`. Doing so would make every tablet look empty.
- Do not move the page to a different address without expecting an empty list on every device.
- Do not clear the browser data on a tablet that still has unsent hours. It deletes them; export first.
- Do not point a tablet at an earlier year's sheet. Sessions from another year are refused.

## Files in the repo

| File | What it is |
| --- | --- |
| `index.html` | The whole app in one file |
| `sw.js` | Service worker: offline copy and background update |
| `manifest.webmanifest` | Name, colours, icon for the install prompt |
| `icon.svg` | The icon |
| `SETUP.md` | This document |
| `README.md` | Short public description |
