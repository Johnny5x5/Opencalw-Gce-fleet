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
    Console,
}

impl From<MenuItem> for usize {
    fn from(input: MenuItem) -> usize {
        match input {
            MenuItem::Status => 0,
            MenuItem::Mission => 1,
            MenuItem::Mesh => 2,
            MenuItem::Console => 3,
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
    let menu_titles = vec!["Status", "Mission", "Mesh", "Console"];
    let mut active_menu_item = MenuItem::Status;

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

            let tabs = Tabs::new(menu)
                .select(active_menu_item.into())
                .block(Block::default().title("NomadOS - Sovereign Edition").borders(Borders::ALL))
                .style(Style::default().fg(Color::White))
                .highlight_style(Style::default().fg(Color::Yellow))
                .divider(Span::raw("|"));

            rect.render_widget(tabs, chunks[0]);

            // 2. Main Content Area
            match active_menu_item {
                MenuItem::Status => {
                    let status_chunks = Layout::default()
                        .direction(Direction::Horizontal)
                        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)].as_ref())
                        .split(chunks[1]);

                    // Left Panel: Core Usage
                    let cores = vec![
                        ListItem::new("Core 0 (User): 12% [ACTIVE]"),
                        ListItem::new("Core 1 (Radio): 99% [ACTIVE] (LoRa/Sat)"),
                        ListItem::new("Core 2 (Crypto): 5% [IDLE]"),
                        ListItem::new("Core 3 (Storage): 45% [ACTIVE] (DTN Sync)"),
                    ];
                    let core_list = List::new(cores).block(Block::default().title("Core Status (AMP)").borders(Borders::ALL));
                    rect.render_widget(core_list, status_chunks[0]);

                    // Right Panel: Environment
                    let env_data = vec![
                        ListItem::new("Battery: 87% (Solar Charging)"),
                        ListItem::new("GPS: 34.0522° N, 118.2437° W (3D Fix)"),
                        ListItem::new("Temp: 32°C / Humidity: 45%"),
                        ListItem::new("Signal: -85dBm (Strong)"),
                    ];
                    let env_list = List::new(env_data).block(Block::default().title("Environment").borders(Borders::ALL));
                    rect.render_widget(env_list, status_chunks[1]);
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
                    let nodes = vec![
                        ListItem::new("[YOU] -> (LoRa) -> [NODE-ALPHA] (Relay)"),
                        ListItem::new("[NODE-ALPHA] -> (Sat) -> [UPLINK-STATION]"),
                        ListItem::new("[NODE-BRAVO] (Offline - Last seen 4h ago)"),
                    ];
                    let mesh_list = List::new(nodes).block(Block::default().title("Mesh Topology").borders(Borders::ALL));
                    rect.render_widget(mesh_list, chunks[1]);
                }
                MenuItem::Console => {
                    let console = Paragraph::new("> type command here...")
                        .block(Block::default().title("Sovereign Shell").borders(Borders::ALL));
                    rect.render_widget(console, chunks[1]);
                }
            }

            // 3. Footer
            let footer = Paragraph::new("Press 'q' to quit, Tab to switch views")
                .style(Style::default().fg(Color::Gray))
                .block(Block::default().borders(Borders::TOP));
            rect.render_widget(footer, chunks[2]);

        })?;

        // Input Handling
        if let Event::Key(key) = event::read()? {
            match key.code {
                KeyCode::Char('q') => break,
                KeyCode::Tab => {
                    active_menu_item = match active_menu_item {
                        MenuItem::Status => MenuItem::Mission,
                        MenuItem::Mission => MenuItem::Mesh,
                        MenuItem::Mesh => MenuItem::Console,
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
