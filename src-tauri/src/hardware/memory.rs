//! 内存信息采集模块
//! 
//! 负责采集系统内存使用情况，并通过 WMI 获取真实的内存规格（DDR4/DDR5 与频率）

use sysinfo::System;
use super::types::MemoryInfo;
use serde::Deserialize;
use std::sync::Mutex;
use once_cell::sync::Lazy;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
struct Win32PhysicalMemory {
    speed: Option<u32>,
    configured_clock_speed: Option<u32>,
    memory_type: Option<u32>,
    #[serde(rename = "SMBIOSMemoryType")]
    smbios_memory_type: Option<u32>,
}

#[derive(Clone)]
struct MemoryHardwareSpecs {
    memory_type: Option<String>,
    frequency: Option<u32>,
}

/// 内存物理规格缓存（启动后仅通过 WMI 探测一次即可，硬件运行中不会变动）
static MEMORY_SPECS_CACHE: Lazy<Mutex<Option<MemoryHardwareSpecs>>> = Lazy::new(|| {
    Mutex::new(None)
});

/// 获取物理内存硬件规格（类型与频率）
fn get_memory_specs() -> MemoryHardwareSpecs {
    if let Ok(guard) = MEMORY_SPECS_CACHE.lock() {
        if let Some(specs) = guard.as_ref() {
            return specs.clone();
        }
    }

    let mut detected_type = None;
    let mut max_speed = None;

    if let Ok(com_lib) = wmi::COMLibrary::new() {
        if let Ok(wmi_con) = wmi::WMIConnection::new(com_lib) {
            if let Ok(modules) = wmi_con.query::<Win32PhysicalMemory>() {
                for m in &modules {
                    if let Some(speed) = m.configured_clock_speed.or(m.speed) {
                        if speed > max_speed.unwrap_or(0) {
                            max_speed = Some(speed);
                        }
                    }

                    if detected_type.is_none() {
                        let smbios = m.smbios_memory_type.unwrap_or(0);
                        let mtype = m.memory_type.unwrap_or(0);
                        let type_name = match smbios {
                            34 => "DDR5",
                            35 => "LPDDR5",
                            26 => "DDR4",
                            29 => "LPDDR4",
                            24 => "DDR3",
                            21 => "DDR2",
                            20 => "DDR",
                            _ => match mtype {
                                26 => "DDR4",
                                24 => "DDR3",
                                21 => "DDR2",
                                20 => "DDR",
                                _ => "",
                            },
                        };
                        if !type_name.is_empty() {
                            detected_type = Some(type_name.to_string());
                        }
                    }
                }
            }
        }
    }

    let specs = MemoryHardwareSpecs {
        memory_type: detected_type,
        frequency: max_speed,
    };

    if let Ok(mut guard) = MEMORY_SPECS_CACHE.lock() {
        *guard = Some(specs.clone());
    }

    specs
}

/// 获取内存详细信息
pub fn get_memory_info(sys: &System) -> MemoryInfo {
    let total = sys.total_memory() / (1024 * 1024); // 转换为 MB
    let used = sys.used_memory() / (1024 * 1024);
    let available = sys.available_memory() / (1024 * 1024);
    
    // 计算使用率
    let usage = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };

    let specs = get_memory_specs();
    
    MemoryInfo {
        total,
        used,
        available,
        usage,
        memory_type: specs.memory_type,
        frequency: specs.frequency,
    }
}

/// 获取当前内存使用率
pub fn get_memory_usage(sys: &System) -> f32 {
    let total = sys.total_memory();
    let used = sys.used_memory();
    
    if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    }
}
