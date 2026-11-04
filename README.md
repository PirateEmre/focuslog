# Focuslog

A calm, lightweight study companion for planning your day and protecting your focus.

![Focuslog preview](https://dummyimage.com/1200x630/191e29/a997ff&text=Focuslog)

## Features

- **Focus timer** — 25-minute focus sessions, short breaks and long breaks.
- **Task list** — add, complete and remove daily tasks.
- **Progress at a glance** — daily focus minutes, completed sessions and current streak.
- **Weekly overview** — a simple seven-day chart of your focus time.
- **Local-first storage** — your tasks and sessions stay in your browser with localStorage.
- **Responsive interface** — works on desktop, tablet and mobile.
- **No account required** — open the page and get started.

## Getting started

No build step or dependencies required.

1. Clone the repository:
   ```bash
   git clone https://github.com/PirateEmre/focuslog.git
   cd focuslog
   ```
2. Open `index.html` in your browser.

For a local development server, you can also run:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Project structure

```text
focuslog/
├── index.html   # App layout
├── styles.css   # Responsive visual design
├── app.js       # Timer, tasks and progress logic
├── README.md
└── LICENSE
```

## Data and privacy

Focuslog does not use a backend or send your tasks anywhere. Data is stored locally in your browser. Clearing your browser storage will remove your Focuslog data.

## Roadmap

- [ ] Custom focus and break durations
- [ ] Export and import personal data
- [ ] Keyboard shortcuts
- [ ] Optional ambient sounds

## Contributing

Ideas, bug reports and pull requests are welcome. If Focuslog helps your routine, consider giving the repository a ⭐.

## License

MIT
