# Clock In Page

A one-page clock for a team of about twenty. People tap their name to clock in, tap again to clock out. An admin screen adds, renames and removes names, and exports the hours to Excel.

Built for a tablet on a wall. It needs no server, no account and no internet: once the page has loaded on a device, it keeps working offline.

Live at https://adioan.github.io/clock-in-page/ (after GitHub Pages is switched on in Settings, Pages, Deploy from a branch, `main` / root).

## The screen

- Search box, then the team list. Every row is a name, a large orange button and, while someone is clocked in, the time they arrived.
- The button is orange ("Tap Here to Clock In") and turns green ("Tap to clock out") when that person is in.
- "Add new name" next to the search opens a small panel that adds a name to the list.
- A nine second Undo appears after every tap.

## Admin

`Admin` at the top left, PIN `1234` by default. Change it in Admin, Admin PIN, which asks for the new PIN twice.

From there: the clock name, the list of people (add, edit, remove), the Excel export with a period of All time, Today, Past 7 days, Past 30 days or This year, and a way to delete everything.

## The export

An `.xlsx` with three sheets. Hours are a real formula, `ROUND((D2-C2)*96,0)/4`, so they round to the nearest quarter hour and recalculate if a time is edited: 2h34m becomes 2.5, 1h08m becomes 1.25. Summary totals use `SUMIF` over the Timesheet. Date and time are stored as dates and times, not text.

## Where the data lives

In the browser on the device, under `localStorage` key `timeclock.v1`. Nothing is sent anywhere and nothing is stored in this repository. That also means:

- each tablet has its own list and its own records;
- clearing the browser data deletes the records;
- moving to a different address (`file://` to the live URL, for example) starts an empty list;
- export to Excel regularly if the hours matter.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app, one self-contained file, no dependencies |
| `sw.js` | Service worker, so the page opens with no signal |
| `manifest.webmanifest` | Name, colours and icon for "Add to Home screen" |
| `icon.svg` | The icon |
| `SETUP.md` | Operator instructions: install, update, troubleshoot |

## Updating

The page updates itself on the devices. When it is opened with a connection, the service worker stores a fresh copy in the background and the next open shows it; a page left open all day also checks once an hour. With no connection the stored copy keeps working and the hours are untouched, because they live in the device's storage under the site address.

To publish a change: replace `index.html`, bump `var APP_VERSION` near the top of it, and commit. If `sw.js` changed too, bump `clock-in-page-v1` to the next number. Full operator instructions, including installing on a tablet and what to do when a device looks stale, are in [SETUP.md](SETUP.md).

## Notes

- The default PIN is in the source, so it is a deterrent, not security. Change it on the device; the new PIN stays on that device.
- Never commit an exported timesheet: those contain real names and hours.
