// Nomad Kernel: Interface to seL4
#![no_std]

pub struct Capability {
    pub cptr: usize,
    pub rights: u8,
}

pub fn sys_yield() {
    // Syscall to seL4 yield
}

pub fn sys_send(cap: Capability, msg: &[u8]) {
    // Syscall to send IPC
}
