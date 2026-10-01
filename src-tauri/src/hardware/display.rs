//! 显示器信息采集模块
//! 
//! 通过 Win32 EnumDisplayDevicesW 和 EnumDisplaySettingsW 获取系统所有活动显示器
//! 的完整参数（分辨率、刷新率、设备标识、是否为主屏等），支持多显示器识别。

use windows_sys::Win32::Graphics::Gdi::{
    EnumDisplayDevicesW, EnumDisplaySettingsW, DEVMODEW, DISPLAY_DEVICEW, ENUM_CURRENT_SETTINGS,
};
use super::types::DisplayInfo;

const DISPLAY_DEVICE_ATTACHED_TO_DESKTOP: u32 = 0x00000001;
const DISPLAY_DEVICE_PRIMARY_DEVICE: u32 = 0x00000004;

/// 获取系统中所有连接且处于活动状态的显示器列表
pub fn get_all_displays() -> Vec<DisplayInfo> {
    let mut displays = Vec::new();

    unsafe {
        let mut dev_idx = 0u32;
        loop {
            let mut dd: DISPLAY_DEVICEW = std::mem::zeroed();
            dd.cb = std::mem::size_of::<DISPLAY_DEVICEW>() as u32;

            if EnumDisplayDevicesW(std::ptr::null(), dev_idx, &mut dd, 0) == 0 {
                break;
            }
            dev_idx += 1;

            // 过滤：仅保留当前附加到桌面的活动显示设备
            if (dd.StateFlags & DISPLAY_DEVICE_ATTACHED_TO_DESKTOP) == 0 {
                continue;
            }

            let is_primary = (dd.StateFlags & DISPLAY_DEVICE_PRIMARY_DEVICE) != 0;

            let mut mode: DEVMODEW = std::mem::zeroed();
            mode.dmSize = std::mem::size_of::<DEVMODEW>() as u16;

            let ok = EnumDisplaySettingsW(
                dd.DeviceName.as_ptr(),
                ENUM_CURRENT_SETTINGS,
                &mut mode,
            );

            if ok != 0 && mode.dmPelsWidth > 0 && mode.dmPelsHeight > 0 {
                let dev_name_len = dd.DeviceName.iter().position(|&c| c == 0).unwrap_or(dd.DeviceName.len());
                let dev_name = String::from_utf16_lossy(&dd.DeviceName[..dev_name_len]);

                // 二级查询：获取连接在此显示接口上的物理显示器名称
                let mut mon_dd: DISPLAY_DEVICEW = std::mem::zeroed();
                mon_dd.cb = std::mem::size_of::<DISPLAY_DEVICEW>() as u32;
                let mut friendly_name = String::new();
                if EnumDisplayDevicesW(dd.DeviceName.as_ptr(), 0, &mut mon_dd, 0) != 0 {
                    let str_len = mon_dd.DeviceString.iter().position(|&c| c == 0).unwrap_or(mon_dd.DeviceString.len());
                    let mon_str = String::from_utf16_lossy(&mon_dd.DeviceString[..str_len]).trim().to_string();
                    if !mon_str.is_empty() && mon_str != "Default Monitor" {
                        friendly_name = mon_str;
                    }
                }

                let display_idx = displays.len() as u32;
                let display_name = if !friendly_name.is_empty() {
                    friendly_name
                } else if is_primary {
                    format!("Monitor {} (Principal)", display_idx + 1)
                } else {
                    format!("Monitor {}", display_idx + 1)
                };

                displays.push(DisplayInfo {
                    id: display_idx,
                    name: display_name,
                    device_name: dev_name,
                    width: mode.dmPelsWidth,
                    height: mode.dmPelsHeight,
                    refresh_rate: mode.dmDisplayFrequency,
                    is_primary,
                });
            }
        }
    }

    // 优先主显示器排在最前
    displays.sort_by(|a, b| b.is_primary.cmp(&a.is_primary));

    // 重新校准序号 id
    for (i, d) in displays.iter_mut().enumerate() {
        d.id = i as u32;
    }

    if displays.is_empty() {
        displays.push(get_display_info());
    }

    displays
}

/// 获取主显示器当前模式信息（保留向后兼容）
pub fn get_display_info() -> DisplayInfo {
    unsafe {
        let mut mode: DEVMODEW = std::mem::zeroed();
        mode.dmSize = std::mem::size_of::<DEVMODEW>() as u16;

        let ok = EnumDisplaySettingsW(
            std::ptr::null(),
            ENUM_CURRENT_SETTINGS,
            &mut mode,
        );

        if ok != 0 {
            DisplayInfo {
                id: 0,
                name: "Monitor 1 (Principal)".to_string(),
                device_name: "\\\\.\\DISPLAY1".to_string(),
                width: mode.dmPelsWidth,
                height: mode.dmPelsHeight,
                refresh_rate: mode.dmDisplayFrequency,
                is_primary: true,
            }
        } else {
            DisplayInfo {
                id: 0,
                name: "Monitor".to_string(),
                device_name: "".to_string(),
                width: 0,
                height: 0,
                refresh_rate: 0,
                is_primary: true,
            }
        }
    }
}
