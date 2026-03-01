use std::fs;
use std::path::Path;
use anyhow::Result;
use rand::Rng;

pub struct IronDome {
    pub doctrine_path: String,
    pub status: String,
    pub active_rules: Vec<String>,
    pub threats_blocked: u32,
}

impl IronDome {
    pub fn new(doctrine_path: &str) -> Self {
        Self {
            doctrine_path: doctrine_path.to_string(),
            status: "INITIALIZING".to_string(),
            active_rules: Vec::new(),
            threats_blocked: 0,
        }
    }

    pub fn activate(&mut self) -> Result<()> {
        self.load_doctrine()?;
        self.scan_perimeter();
        self.update_blocklist();
        self.status = "ACTIVE".to_string();
        Ok(())
    }

    fn load_doctrine(&mut self) -> Result<()> {
        if Path::new(&self.doctrine_path).exists() {
            let content = fs::read_to_string(&self.doctrine_path)?;
            // Simple keyword extraction from Markdown
            if content.contains("12nm Firewall") {
                self.active_rules.push("RULE_12NM_DPI".to_string());
            }
            if content.contains("Immune System") {
                self.active_rules.push("RULE_HOST_IDS".to_string());
            }
            if content.contains("Active Defense") {
                self.active_rules.push("RULE_ACTIVE_HONEYPOT".to_string());
            }
        } else {
            self.status = "COMPROMISED (MISSING DOCTRINE)".to_string();
        }
        Ok(())
    }

    fn scan_perimeter(&mut self) {
        let mut rng = rand::thread_rng();
        // Simulate scanning
        if rng.gen_bool(0.5) {
            self.threats_blocked += 1;
        }
    }

    fn update_blocklist(&self) {
        // In prod, write to /etc/hosts.deny
        // Here we just log internally
    }
}
