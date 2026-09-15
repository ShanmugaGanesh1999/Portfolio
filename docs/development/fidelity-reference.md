# Interface fidelity references

Reviewed on **2026-09-15**. Target: a macOS-style dark **Cursor IDE with Agent sidepane** and a **Claude Code terminal**, adapted to read-only portfolio documents. This release is not a pixel-identical or native-functionality parity claim.

## Official sources

| Source | Use |
| --- | --- |
| [Cursor product demos](https://cursor.com/home) | Official interactive IDE demo: document tabs, plan content, adjacent Agent composer. The homepage also shows the distinct Agents Window and CLI; those are not the IDE target. |
| [Cursor Agent overview](https://cursor.com/docs/agent/overview) | Agent sidepane, document search/read operations, model selection and tool feedback. Current docs advertise Cmd/Ctrl+I for the sidepane. |
| [Cursor themes and appearance](https://cursor.com/help/customization/themes) | Cursor Dark theme, separate editor font preferences, command palette and platform-specific shortcuts. |
| [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode) | Prompt shortcuts, command history, interruption, permission mode cycling, rewind and task display. |
| [Claude Code terminal configuration](https://code.claude.com/docs/en/terminal-config) | Terminal-dependent appearance and theme behavior. |
| [Claude Code overview](https://code.claude.com/docs/en/overview) | Product scope and distinction between terminal and other interfaces. |

## Deliberate portfolio behavior

- Intro commands run automatically and display portfolio data progressively.
- Loading stages last a random 500–2,000 ms, independently of network latency.
- Documents and local terminal operations are read-only. Mode labels do not grant OS or repository access.
- Browser-local conversation restoration replaces native project sessions.
- Mobile uses an adapted layout. Browser-reserved keyboard shortcuts may take priority.
- Common editor chrome icons use lightweight inline SVGs; these are approximations, not copied official icon assets.

## Evidence limits and comparison protocol

The URLs above were inspected as official documentation/product references. They are live pages, not a pinned application version, and the captured text does not establish exact dimensions or colors. A native macOS release build, exact terminal emulator/font configuration, and matched screenshot pair were not available in this review. Do not describe these references as a completed pixel-diff baseline.

For future visual comparisons, record the native app version, terminal emulator, macOS version, theme, font and font size, viewport and display scale. Compare idle, loading, command menu, search, document and Agent states at the same size. Test the mobile adaptation separately from desktop fidelity.
