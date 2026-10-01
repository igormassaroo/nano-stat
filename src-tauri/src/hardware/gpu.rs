//! GPU 信息采集模块
//! 
//! 支持 NVIDIA (NVML)、AMD 和 Intel 集显 (WMI)，支持多 GPU 识别

use super::types::GpuInfo;
use nvml_wrapper::Nvml;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use serde::Deserialize;

/// 全局 NVML 实例 (用于 NVIDIA 显卡)
static NVML: Lazy<Mutex<Option<Nvml>>> = Lazy::new(|| {
    Mutex::new(Nvml::init().ok())
});

/// WMI GPU 信息结构
#[derive(Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
struct Win32VideoController {
    name: Option<String>,
    adapter_ram: Option<u64>,
    driver_version: Option<String>,
}

/// GPU 品牌类型
#[derive(Debug, Clone, PartialEq)]
enum GpuBrand {
    Nvidia,
    Amd,
    Intel,
    Unknown,
}

/// 检测 GPU 品牌
fn detect_gpu_brand(name: &str) -> GpuBrand {
    let name_lower = name.to_lowercase();
    if name_lower.contains("nvidia") || name_lower.contains("geforce") || name_lower.contains("quadro") || name_lower.contains("rtx") || name_lower.contains("gtx") {
        GpuBrand::Nvidia
    } else if name_lower.contains("amd") || name_lower.contains("radeon") || name_lower.contains("rx ") {
        GpuBrand::Amd
    } else if name_lower.contains("intel") || name_lower.contains("uhd") || name_lower.contains("iris") || name_lower.contains("hd graphics") {
        GpuBrand::Intel
    } else {
        GpuBrand::Unknown
    }
}

/// 获取所有检测到的 GPU 列表（优先 NVML 获取的 NVIDIA 独显，其次 WMI 获取的 Intel/AMD 集显与独显）
pub fn get_all_gpus() -> Vec<GpuInfo> {
    let mut gpus = Vec::new();

    // 1. 通过 NVML 获取所有 NVIDIA GPU
    if let Ok(nvml_guard) = NVML.lock() {
        if let Some(nvml) = nvml_guard.as_ref() {
            let count = nvml.device_count().unwrap_or(0);
            for i in 0..count {
                if let Ok(device) = nvml.device_by_index(i) {
                    let name = device.name().unwrap_or_else(|_| format!("NVIDIA GPU {}", i));
                    let memory_info = device.memory_info().ok();
                    let vram_total = memory_info.as_ref().map(|m| m.total / (1024 * 1024)).unwrap_or(0);
                    let vram_used = memory_info.as_ref().map(|m| m.used / (1024 * 1024)).unwrap_or(0);
                    let utilization = device.utilization_rates().ok();
                    let usage = utilization.map(|u| u.gpu as f32).unwrap_or(0.0);
                    let temperature = device.temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu).ok().map(|t| t as f32);
                    let power_usage = device.power_usage().ok().map(|p| p as f32 / 1000.0);
                    let core_clock = device.clock_info(nvml_wrapper::enum_wrappers::device::Clock::Graphics).ok();
                    let memory_clock = device.clock_info(nvml_wrapper::enum_wrappers::device::Clock::Memory).ok();
                    let pcie_info = device.pci_info().ok().map(|_| {
                        format!("PCIe x{} @ Gen{}", 
                            device.current_pcie_link_width().unwrap_or(0),
                            device.current_pcie_link_gen().unwrap_or(0)
                        )
                    });
                    let driver_version = nvml.sys_driver_version().ok();

                    gpus.push(GpuInfo {
                        name,
                        brand: "NVIDIA".to_string(),
                        vram_total,
                        vram_used,
                        usage,
                        temperature,
                        power_usage,
                        core_clock,
                        memory_clock,
                        pcie_info,
                        driver_version,
                    });
                }
            }
        }
    }

    // 2. 通过 WMI 获取 AMD / Intel 以及其他显示适配器
    if let Ok(com_lib) = wmi::COMLibrary::new() {
        if let Ok(wmi_con) = wmi::WMIConnection::new(com_lib) {
            if let Ok(results) = wmi_con.query::<Win32VideoController>() {
                for controller in results {
                    if let Some(name) = controller.name {
                        let brand = detect_gpu_brand(&name);
                        let name_lower = name.to_lowercase();

                        // 避免重复收录已在 NVML 中采集的 NVIDIA 显卡
                        let already_exists = gpus.iter().any(|g| {
                            let existing_lower = g.name.to_lowercase();
                            existing_lower.contains(&name_lower) 
                                || name_lower.contains(&existing_lower) 
                                || (g.brand == "NVIDIA" && name_lower.contains("nvidia"))
                        });

                        if !already_exists {
                            let brand_str = match brand {
                                GpuBrand::Amd => "AMD",
                                GpuBrand::Intel => "Intel",
                                GpuBrand::Nvidia => "NVIDIA",
                                _ => "Outro",
                            }.to_string();

                            let vram_total = controller.adapter_ram.unwrap_or(0) / (1024 * 1024);

                            gpus.push(GpuInfo {
                                name,
                                brand: brand_str,
                                vram_total,
                                vram_used: 0,
                                usage: 0.0,
                                temperature: None,
                                power_usage: None,
                                core_clock: None,
                                memory_clock: None,
                                pcie_info: None,
                                driver_version: controller.driver_version,
                            });
                        }
                    }
                }
            }
        }
    }

    // 优先级排序：独立显卡排在最前 (NVIDIA > AMD > Intel > Other)
    gpus.sort_by_key(|g| match g.brand.as_str() {
        "NVIDIA" => 0,
        "AMD" => 1,
        "Intel" => 2,
        _ => 3,
    });

    gpus
}

/// 获取首要 GPU 详细信息（主独显，用于向后兼容单卡接口）
pub fn get_gpu_info() -> Option<GpuInfo> {
    get_all_gpus().into_iter().next()
}

/// 获取当前 GPU 使用率
pub fn get_gpu_usage() -> f32 {
    let nvml_guard = match NVML.lock() {
        Ok(guard) => guard,
        Err(_) => return 0.0,
    };
    
    let nvml = match nvml_guard.as_ref() {
        Some(nvml) => nvml,
        None => return 0.0,
    };
    
    let device = match nvml.device_by_index(0) {
        Ok(device) => device,
        Err(_) => return 0.0,
    };
    
    device.utilization_rates()
        .map(|u| u.gpu as f32)
        .unwrap_or(0.0)
}

/// 获取当前 GPU 温度
pub fn get_gpu_temperature() -> Option<f32> {
    // 优先 LHM（支持 NVIDIA/AMD/Intel 全品牌）
    if let Some(temp) = super::lhm::get_gpu_temp() {
        return Some(temp);
    }
    
    // 回退到 NVML
    let nvml_guard = NVML.lock().ok()?;
    let nvml = nvml_guard.as_ref()?;
    let device = nvml.device_by_index(0).ok()?;
    
    device.temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu)
        .ok()
        .map(|t| t as f32)
}

/// GPU 实时补充指标（显存已用 MB, 显存总量 MB, 核心频率 MHz, 功耗 W）
pub fn get_gpu_extra() -> (Option<u64>, Option<u64>, Option<u32>, Option<f32>) {
    let nvml_guard = match NVML.lock() {
        Ok(guard) => guard,
        Err(_) => return (None, None, None, None),
    };

    let nvml = match nvml_guard.as_ref() {
        Some(nvml) => nvml,
        None => return (None, None, None, None),
    };

    let device = match nvml.device_by_index(0) {
        Ok(device) => device,
        Err(_) => return (None, None, None, None),
    };

    // 显存（MB）
    let (vram_used, vram_total) = device.memory_info().ok().map(|m| {
        (m.used / (1024 * 1024), m.total / (1024 * 1024))
    }).unwrap_or((0, 0));
    let vram_used = (vram_used > 0).then_some(vram_used);
    let vram_total = (vram_total > 0).then_some(vram_total);

    // 核心频率（MHz）
    let clock = device
        .clock_info(nvml_wrapper::enum_wrappers::device::Clock::Graphics)
        .ok();

    // 功耗（mW → W）
    let power = device.power_usage().ok().map(|p| p as f32 / 1000.0);

    (vram_used, vram_total, clock, power)
}
