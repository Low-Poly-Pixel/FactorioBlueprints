# Blueprint string fixtures

One plain-text file per export string, raw and unmodified — just the `0eNq...` blob copied straight from Factorio's clipboard export, nothing else in the file (no JSON wrapper, no trailing newline needed). Filename is just a label for humans, e.g. `main-bus-4-lane.txt`; it isn't read by the decoder.

Used to seed local dev D1 data — never committed to production data, and not test fixtures for an eventual test suite (though they could be reused there later).
