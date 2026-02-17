use std::io;
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Span, Line},
    widgets::{Block, Borders, List, ListItem, Paragraph, Tabs},
    Terminal,
};
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};

#[derive(Clone, Copy)]
enum MenuItem {
    Status,
    Mission,
    Mesh,
    Library, // New RAG Tab
    Console,
}

impl From<MenuItem> for usize {
    fn from(input: MenuItem) -> usize {
        match input {
            MenuItem::Status => 0,
            MenuItem::Mission => 1,
            MenuItem::Mesh => 2,
            MenuItem::Library => 3,
            MenuItem::Console => 4,
        }
    }
}

fn main() -> Result<(), io::Error> {
    // Setup Terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // App State
    let menu_titles = vec!["Status", "Mission", "Mesh", "Library", "Console"];
    let mut active_menu_item = MenuItem::Status;
    let mut is_folded = true; // Phone Mode by default

    // Main Loop
    loop {
        terminal.draw(|rect| {
            let size = rect.size();
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(2)
                .constraints(
                    [
                        Constraint::Length(3), // Menu Bar
                        Constraint::Min(2),    // Content
                        Constraint::Length(3), // Footer
                    ]
                    .as_ref(),
                )
                .split(size);

            // 1. Menu Bar (Tabs)
            let menu = menu_titles
                .iter()
                .map(|t| {
                    let (first, rest) = t.split_at(1);
                    Line::from(vec![
                        Span::styled(
                            first,
                            Style::default()
                                .fg(Color::Yellow)
                                .add_modifier(Modifier::UNDERLINED),
                        ),
                        Span::styled(rest, Style::default().fg(Color::White)),
                    ])
                })
                .collect();

            let title = if is_folded {
                "NomadOS (Phone Mode)"
            } else {
                "NomadOS (Station Mode - 8 Cores Active) [Max: 128]"
            };

            let tabs = Tabs::new(menu)
                .select(active_menu_item.into())
                .block(Block::default().title(title).borders(Borders::ALL))
                .style(Style::default().fg(Color::White))
                .highlight_style(Style::default().fg(Color::Yellow))
                .divider(Span::raw("|"));

            rect.render_widget(tabs, chunks[0]);

            // 2. Main Content Area
            match active_menu_item {
                MenuItem::Status => {
                    let layout = if is_folded {
                        // Phone Mode: Vertical Stack
                        Layout::default()
                            .direction(Direction::Vertical)
                            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)].as_ref())
                            .split(chunks[1])
                    } else {
                        // Station Mode: Horizontal Split
                        Layout::default()
                            .direction(Direction::Horizontal)
                            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)].as_ref())
                            .split(chunks[1])
                    };

                    // Left Panel: Core Usage
                    let mut cores = vec![
                        ListItem::new("Core 0 (Kernel): seL4 Hypervisor [ACTIVE]"),
                        ListItem::new("Core 1 (Janitor): System GC [ACTIVE]"),
                        ListItem::new("Core 2 (User): UI Shell [ACTIVE]"),
                        ListItem::new("Core 3 (Radio): LoRa/Sat Driver [ACTIVE]"),
                    ];

                    if !is_folded {
                        cores.push(ListItem::new("Core 4-7 (AI Cluster): Llama-3-8B [ACTIVE]"));
                        cores.push(ListItem::new("Core 5: Vector Search [ACTIVE]"));
                        cores.push(ListItem::new("Core 6: Crypto [ACTIVE]"));
                        cores.push(ListItem::new("Core 7: Storage [ACTIVE]"));
                    } else {
                        cores.push(ListItem::new("Core 4-7: [SLEEPING] (Power Save)"));
                    }

                    cores.push(ListItem::new(""));
                    cores.push(ListItem::new("Message Queue: 5 Pending (Store-and-Forward)"));

                    let core_list = List::new(cores).block(Block::default().title("Core Status (8-Core AMP)").borders(Borders::ALL));
                    rect.render_widget(core_list, layout[0]);

                    // Right Panel: Environment
                    let env_data = vec![
                        ListItem::new("Battery: 87% (Solar Charging)"),
                        ListItem::new("GPS: 34.0522° N, 118.2437° W (3D Fix)"),
                        ListItem::new("Temp: 32°C / Humidity: 45%"),
                        ListItem::new("Signal: -85dBm (Strong)"),
                        ListItem::new(""),
                        ListItem::new("Immune System: DEFCON 5 [NORMAL]"),
                        ListItem::new("Identity: did:nomad:sim... [VERIFIED]"),
                    ];
                    let env_list = List::new(env_data).block(Block::default().title("Environment & Security").borders(Borders::ALL));
                    rect.render_widget(env_list, layout[1]);
                }
                MenuItem::Mission => {
                    let missions = vec![
                        ListItem::new("BUNDLE-001: [OUTBOUND] 'Request Water' -> Cloud (Queued: 2 days)"),
                        ListItem::new("BUNDLE-002: [INBOUND] 'Sector Map' <- Cloud (Received)"),
                        ListItem::new("BUNDLE-003: [DRAFT] 'Medical Emergency' (Waiting for Encryption)"),
                    ];
                    let mission_list = List::new(missions).block(Block::default().title("Active Missions (DTN Queue)").borders(Borders::ALL));
                    rect.render_widget(mission_list, chunks[1]);
                }
                MenuItem::Mesh => {
                    let layout = Layout::default()
                        .direction(Direction::Horizontal)
                        .constraints([Constraint::Percentage(60), Constraint::Percentage(40)].as_ref())
                        .split(chunks[1]);

                    // Mesh Topology
                    // Mesh Topology with Signal Stats
                    let nodes = vec![
                        ListItem::new("[YOU] -> (LoRa) -> [NODE-ALPHA] (Relay) | SNR: +8dB | RTT: 450ms"),
                        ListItem::new("[NODE-ALPHA] -> (Sat) -> [UPLINK-STATION] | SNR: -110dB | RTT: 2.1s"),
                        ListItem::new("[NODE-BRAVO] (Offline - Last seen 4h ago) | Packets Queued: 12"),
                        ListItem::new(""),
                        ListItem::new("Radio Status: LoRa [TX/RX] | WiFi [SCAN] | Sat [SLEEP]"),
                        ListItem::new("Spectrum Guard: ACTIVE [FCC Mode]"),
                        ListItem::new("Allowed Bands: ISM (915MHz), WiFi (2.4/5GHz)"),
                        ListItem::new("Blocked Bands: MilAir, Marine VHF (No License)"),
                    ];
                    let mesh_list = List::new(nodes).block(Block::default().title("Mesh Topology & Signal Intelligence").borders(Borders::ALL));
                    rect.render_widget(mesh_list, layout[0]);

                    // Storage Replication Status (Tri-Tier)
                    let storage = vec![
                        ListItem::new("Tier 1 (Local): NVMe RAID 0 [HEALTHY]"),
                        ListItem::new("Tier 2 (Mesh): TiKV Consensus [SEARCHING...]"),
                        ListItem::new("Tier 3 (Cloud): CockroachDB [CONNECTED]"),
                        ListItem::new(""),
                        ListItem::new("Sync Queue: 12 Objects Pending"),
                    ];
                    let storage_list = List::new(storage).block(Block::default().title("Storage Sovereignty").borders(Borders::ALL));
                    rect.render_widget(storage_list, layout[1]);
                }
                MenuItem::Library => {
                    let library_chunks = Layout::default()
                        .direction(Direction::Horizontal)
                        .constraints([Constraint::Percentage(30), Constraint::Percentage(70)].as_ref())
                        .split(chunks[1]);

                    // Index List
                    let docs = vec![
                        ListItem::new("jeep_manual_2024.pdf (Indexed)"),
                        ListItem::new("survival_guide.md (Indexed)"),
                        ListItem::new("area_map_sector_7.png (Vectorized)"),
                    ];
                    let doc_list = List::new(docs).block(Block::default().title("Indexed Knowledge (NVMe)").borders(Borders::ALL));
                    rect.render_widget(doc_list, library_chunks[0]);

                    // Search/Chat
                    let chat = vec![
                        ListItem::new("User: How to fix axle?"),
                        ListItem::new("Librarian: [Retrieving from jeep_manual_2024.pdf...]"),
                        ListItem::new("Analyst (8B): Use a 14mm socket to remove the hub nut..."),
                    ];
                    let chat_list = List::new(chat).block(Block::default().title("RAG Interface").borders(Borders::ALL));
                    rect.render_widget(chat_list, library_chunks[1]);
                }
                MenuItem::Console => {
                    let console = Paragraph::new("> type command here...\n\n[CLOUD TETHER] Status: ACTIVE (80/20 Rule)\n[SYSTEM] Routing strategic query 'Analyze Sector 7' to Federal Brain...\n[REPLY] Estimated: 20s")
                        .block(Block::default().title("Sovereign Shell").borders(Borders::ALL));
                    rect.render_widget(console, chunks[1]);
                }
            }

            // 3. Footer
            let footer = Paragraph::new("Press 'q' to quit, Tab to switch views, 'f' to Fold/Unfold Device")
                .style(Style::default().fg(Color::Gray))
                .block(Block::default().borders(Borders::TOP));
            rect.render_widget(footer, chunks[2]);

        })?;

        // Input Handling
        if let Event::Key(key) = event::read()? {
            match key.code {
                KeyCode::Char('q') => break,
                KeyCode::Char('f') => is_folded = !is_folded, // Toggle Polymorphic Mode
                KeyCode::Tab => {
                    active_menu_item = match active_menu_item {
                        MenuItem::Status => MenuItem::Mission,
                        MenuItem::Mission => MenuItem::Mesh,
                        MenuItem::Mesh => MenuItem::Library,
                        MenuItem::Library => MenuItem::Console,
                        MenuItem::Console => MenuItem::Status,
                    };
                }
                _ => {}
            }
        }
    }

    // Restore Terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen, DisableMouseCapture)?;
    terminal.show_cursor()?;

    Ok(())
}
