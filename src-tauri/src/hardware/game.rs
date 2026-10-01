//! 游戏前台窗口检测模块
//! 
//! 通过 Win32 API 检测当前前台窗口是否为全屏应用（游戏），
//! 支持多显示器环境，准确匹配窗口所在显示器的物理分辨率。

use windows_sys::Win32::Foundation::{HWND, RECT};
use windows_sys::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowRect, GetWindowThreadProcessId, IsWindowVisible,
    GetClassNameW,
};
use windows_sys::Win32::Graphics::Gdi::{
    MonitorFromWindow, GetMonitorInfoW, MONITORINFO,
};

const MONITOR_DEFAULTTONEAREST: u32 = 2;

/// 获取前台窗口的进程 PID（用于 FPS 采集按进程过滤）
/// 排除自身进程与系统外壳，返回 None 表示无有效前台窗口
pub fn get_foreground_pid() -> Option<u32> {
    unsafe {
        let hwnd: HWND = GetForegroundWindow();
        if hwnd.is_null() || IsWindowVisible(hwnd) == 0 {
            return None;
        }

        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut pid);
        if pid == 0 || pid == std::process::id() {
            return None;
        }

        Some(pid)
    }
}

/// 判断前台窗口是否被判定为"游戏"（全屏/无边框全屏窗口，支持多显示器）
pub fn is_game_active() -> bool {
    unsafe {
        let hwnd: HWND = GetForegroundWindow();
        if hwnd.is_null() || IsWindowVisible(hwnd) == 0 {
            return false;
        }

        // 排除自身进程
        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut pid);
        if pid == 0 || pid == std::process::id() {
            return false;
        }

        // 排除 Windows 桌面外壳与任务栏窗口（防止桌面被误认为全屏游戏）
        let mut class_name = [0u16; 64];
        let len = GetClassNameW(hwnd, class_name.as_mut_ptr(), 64);
        if len > 0 {
            let class_str = String::from_utf16_lossy(&class_name[..len as usize]);
            if class_str == "Progman"
                || class_str == "WorkerW"
                || class_str == "Shell_TrayWnd"
                || class_str == "Shell_SecondaryTrayWnd"
                || class_str == "Windows.UI.Core.CoreWindow"
            {
                return false;
            }
        }

        // 获取窗口矩形
        let mut rect: RECT = std::mem::zeroed();
        if GetWindowRect(hwnd, &mut rect) == 0 {
            return false;
        }

        let window_w = (rect.right - rect.left) as f32;
        let window_h = (rect.bottom - rect.top) as f32;
        if window_w <= 100.0 || window_h <= 100.0 {
            return false;
        }

        // 获取当前窗口所在的显示器（多显示器环境准确定位）
        let hmon = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
        if hmon.is_null() {
            return false;
        }

        let mut mi: MONITORINFO = std::mem::zeroed();
        mi.cbSize = std::mem::size_of::<MONITORINFO>() as u32;
        if GetMonitorInfoW(hmon, &mut mi) == 0 {
            return false;
        }

        let screen_w = (mi.rcMonitor.right - mi.rcMonitor.left) as f32;
        let screen_h = (mi.rcMonitor.bottom - mi.rcMonitor.top) as f32;
        if screen_w <= 0.0 || screen_h <= 0.0 {
            return false;
        }

        // 窗口覆盖所在屏幕 >= 95% 视为全屏（兼容无边框全屏，留 5% 容差）
        let cover_w = window_w / screen_w;
        let cover_h = window_h / screen_h;
        cover_w >= 0.95 && cover_h >= 0.95
    }
}
