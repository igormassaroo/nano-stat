export type Language = 'pt-BR' | 'en' | 'zh';

export interface Translations {
  // Navigation & Title
  app_name: string;
  nav_hardware: string;
  nav_monitor: string;
  nav_about: string;
  title_settings: string;
  title_minimize: string;
  title_maximize: string;
  title_close: string;
  refresh: string;
  loading: string;

  // Settings
  settings_dialog_title: string;
  overlay_toggle_title: string;
  overlay_toggle_desc: string;
  panel_position: string;
  pos_TopCenter: string;
  pos_TopLeft: string;
  pos_TopRight: string;
  pos_BottomCenter: string;
  pos_BottomLeft: string;
  pos_BottomRight: string;
  pos_LeftCenter: string;
  pos_RightCenter: string;
  
  display_items: string;
  item_cpu: string;
  item_cpu_temp: string;
  item_gpu: string;
  item_gpu_temp: string;
  item_memory: string;
  item_network: string;
  item_fps: string;
  item_frame_time: string;
  item_fps_1pct: string;
  item_vram: string;
  item_disk: string;
  item_cpu_freq: string;
  item_gpu_freq: string;
  item_gpu_power: string;

  refresh_interval: string;
  bg_opacity: string;
  bg_opacity_desc: string;
  font_size: string;
  font_size_desc: string;
  theme: string;
  theme_dark: string;
  theme_light: string;
  theme_system: string;
  language: string;
  hotkey_title: string;
  hotkey_desc: string;
  save_settings: string;
  close: string;
  target_monitor_title: string;
  target_monitor_desc: string;
  monitor_auto_follow: string;
  monitor_primary: string;
  auto_show_game_title: string;
  auto_show_game_desc: string;
  auto_hide_game_title: string;
  auto_hide_game_desc: string;
  hw_displays: string;
  hw_multiple_gpus: string;

  // Overlay Labels
  overlay_cpu: string;
  overlay_cpu_temp: string;
  overlay_gpu: string;
  overlay_gpu_temp: string;
  overlay_memory: string;
  overlay_vram: string;
  overlay_fps: string;
  overlay_frame_time: string;
  overlay_fps_1pct: string;
  overlay_network: string;
  overlay_disk: string;
  overlay_cpu_freq: string;
  overlay_gpu_freq: string;
  overlay_gpu_power: string;

  // Monitor Page
  monitor_page_title: string;
  monitor_status: string;
  status_enabled: string;
  status_disabled: string;
  hotkey_activation: string;
  hotkey_press_hint: string;
  game_area: string;
  current_config: string;
  help_how_to: string;
  help_how_to_desc: string;

  // Hardware Page
  hw_overview: string;
  hw_processor: string;
  hw_gpu: string;
  hw_memory: string;
  hw_storage: string;
  hw_display: string;
  hw_copy_info: string;
  hw_copied: string;
  hw_cores_threads: string;
  hw_freq: string;
  hw_usage: string;
  hw_vram: string;
  hw_driver: string;
  hw_capacity: string;
  hw_used: string;
  hw_available: string;
  hw_resolution: string;
  hw_refresh_rate: string;
  hw_load: string;
  hw_temp: string;
  hw_gpu_load: string;
  hw_vram_load: string;
  hw_mem_load: string;
  hw_read_speed: string;
  hw_write_speed: string;
  hw_pawnio_hint: string;
  hw_expand_more: string;

  // About Page
  about_title: string;
  about_desc: string;
  about_version: string;
  about_author: string;
  about_open_source: string;
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    app_name: 'NanoStat',
    nav_hardware: 'Hardware',
    nav_monitor: 'Monitor em Jogo',
    nav_about: 'Sobre',
    title_settings: 'Configurações',
    title_minimize: 'Minimizar',
    title_maximize: 'Maximizar',
    title_close: 'Minimizar para bandeja',
    refresh: 'Atualizar',
    loading: 'Carregando...',

    settings_dialog_title: 'Configurações',
    overlay_toggle_title: 'Monitor nos Jogos (Overlay)',
    overlay_toggle_desc: 'Exibe o painel de desempenho por cima dos jogos',
    panel_position: 'Posição do Painel',
    pos_TopCenter: 'Superior Centro',
    pos_TopLeft: 'Superior Esquerdo',
    pos_TopRight: 'Superior Direito',
    pos_BottomCenter: 'Inferior Centro',
    pos_BottomLeft: 'Inferior Esquerdo',
    pos_BottomRight: 'Inferior Direito',
    pos_LeftCenter: 'Lateral Esquerda',
    pos_RightCenter: 'Lateral Direita',

    display_items: 'Métricas Visíveis',
    item_cpu: 'Uso da CPU',
    item_cpu_temp: 'Temperatura da CPU',
    item_gpu: 'Uso da GPU (RTX 5060)',
    item_gpu_temp: 'Temperatura da GPU',
    item_memory: 'Uso de RAM',
    item_network: 'Velocidade de Rede',
    item_fps: 'Taxa de Quadros (FPS)',
    item_frame_time: 'Frametime (ms)',
    item_fps_1pct: '1% Baixa (1% Low FPS)',
    item_vram: 'Uso de VRAM',
    item_disk: 'Leitura / Escrita de Disco',
    item_cpu_freq: 'Frequência da CPU',
    item_gpu_freq: 'Frequência da GPU',
    item_gpu_power: 'Consumo da GPU (W)',

    refresh_interval: 'Intervalo de Atualização',
    bg_opacity: 'Opacidade do Fundo',
    bg_opacity_desc: 'Ajusta a transparência do fundo da barra, mantendo os textos e valores 100% nítidos.',
    font_size: 'Tamanho da Fonte',
    font_size_desc: 'Tamanho dos caracteres (10-20px). A janela se ajusta automaticamente.',
    theme: 'Tema Visual',
    theme_dark: 'Escuro',
    theme_light: 'Claro',
    theme_system: 'Seguir Sistema',
    language: 'Idioma / Language',
    hotkey_title: 'Atalho Global do Overlay',
    hotkey_desc: 'Pressione Shift + F12 no teclado para ativar ou ocultar o painel durante qualquer jogo.',
    save_settings: 'Salvar Configurações',
    close: 'Fechar',
    target_monitor_title: 'Tela do Overlay (Monitor)',
    target_monitor_desc: 'Escolha em qual monitor o painel do jogo será exibido',
    monitor_auto_follow: 'Automático (Tela do Jogo)',
    monitor_primary: 'Principal',
    auto_show_game_title: 'Exibição Automática em Jogos',
    auto_show_game_desc: 'Abrir o overlay automaticamente ao detectar um jogo em tela cheia',
    auto_hide_game_title: 'Ocultar ao Fechar Jogo',
    auto_hide_game_desc: 'Fechar o overlay automaticamente quando o jogo for encerrado',
    hw_displays: 'Monitores Conectados',
    hw_multiple_gpus: 'Placas de Vídeo (GPUs)',

    overlay_cpu: 'CPU',
    overlay_cpu_temp: 'CPU',
    overlay_gpu: 'GPU',
    overlay_gpu_temp: 'GPU',
    overlay_memory: 'RAM',
    overlay_vram: 'VRAM',
    overlay_fps: 'FPS',
    overlay_frame_time: 'FT',
    overlay_fps_1pct: '1% LOW',
    overlay_network: 'REDE',
    overlay_disk: 'DISCO',
    overlay_cpu_freq: 'CPU CLK',
    overlay_gpu_freq: 'GPU CLK',
    overlay_gpu_power: 'GPU W',

    monitor_page_title: 'Painel de Monitoramento nos Jogos',
    monitor_status: 'Status do Monitor',
    status_enabled: 'Ativado',
    status_disabled: 'Desativado',
    hotkey_activation: 'Atalho de Ativação',
    hotkey_press_hint: 'Pressione Shift + F12 a qualquer momento para ligar ou desligar o painel.',
    game_area: 'Área da Janela do Jogo',
    current_config: 'Configuração Atual',
    help_how_to: 'Como ajustar o layout e as métricas?',
    help_how_to_desc: 'Clique no ícone de engrenagem no topo para mudar a posição, ativar métricas, mudar fontes ou ajustar transparência.',

    hw_overview: 'Visão Geral do Hardware',
    hw_processor: 'Processador (CPU)',
    hw_gpu: 'Placa de Vídeo (GPU)',
    hw_memory: 'Memória RAM',
    hw_storage: 'Armazenamento',
    hw_display: 'Tela / Display',
    hw_copy_info: 'Copiar Detalhes',
    hw_copied: 'Copiado!',
    hw_cores_threads: 'Núcleos / Threads',
    hw_freq: 'Frequência',
    hw_usage: 'Uso Atual',
    hw_vram: 'VRAM Total',
    hw_driver: 'Versão do Driver',
    hw_capacity: 'Capacidade Total',
    hw_used: 'Em Uso',
    hw_available: 'Disponível',
    hw_resolution: 'Resolução',
    hw_refresh_rate: 'Taxa de Atualização',
    hw_load: 'Uso',
    hw_temp: 'Temperatura',
    hw_gpu_load: 'Uso da GPU',
    hw_vram_load: 'Uso de VRAM',
    hw_mem_load: 'Uso de Memória',
    hw_read_speed: 'Leitura',
    hw_write_speed: 'Escrita',
    hw_pawnio_hint: 'Instale o driver PawnIO para habilitar a leitura de temperatura da CPU.',
    hw_expand_more: 'Clique para expandir',

    about_title: 'Sobre o NanoStat Custom',
    about_desc: 'Monitor de desempenho leve, moderno e anti-cheat seguro para Windows.',
    about_version: 'Versão',
    about_author: 'Desenvolvedor Original: Chunyu33 | Fork Customizado PT-BR',
    about_open_source: 'Código Aberto sob licença MIT',
  },

  'en': {
    app_name: 'NanoStat',
    nav_hardware: 'Hardware',
    nav_monitor: 'In-Game Monitor',
    nav_about: 'About',
    title_settings: 'Settings',
    title_minimize: 'Minimize',
    title_maximize: 'Maximize',
    title_close: 'Minimize to tray',
    refresh: 'Refresh',
    loading: 'Loading...',

    settings_dialog_title: 'Settings',
    overlay_toggle_title: 'In-Game Overlay',
    overlay_toggle_desc: 'Show real-time performance overlay while playing games',
    panel_position: 'Panel Position',
    pos_TopCenter: 'Top Center',
    pos_TopLeft: 'Top Left',
    pos_TopRight: 'Top Right',
    pos_BottomCenter: 'Bottom Center',
    pos_BottomLeft: 'Bottom Left',
    pos_BottomRight: 'Bottom Right',
    pos_LeftCenter: 'Left Center',
    pos_RightCenter: 'Right Center',

    display_items: 'Visible Metrics',
    item_cpu: 'CPU Usage',
    item_cpu_temp: 'CPU Temperature',
    item_gpu: 'GPU Usage',
    item_gpu_temp: 'GPU Temperature',
    item_memory: 'RAM Usage',
    item_network: 'Network Speed',
    item_fps: 'Framerate (FPS)',
    item_frame_time: 'Frametime (ms)',
    item_fps_1pct: '1% Low FPS',
    item_vram: 'VRAM Usage',
    item_disk: 'Disk I/O',
    item_cpu_freq: 'CPU Frequency',
    item_gpu_freq: 'GPU Frequency',
    item_gpu_power: 'GPU Power (W)',

    refresh_interval: 'Refresh Interval',
    bg_opacity: 'Background Opacity',
    bg_opacity_desc: 'Adjust overlay background transparency while keeping text and numbers fully sharp.',
    font_size: 'Font Size',
    font_size_desc: 'Font size (10-20px). Container resizes automatically.',
    theme: 'Theme',
    theme_dark: 'Dark',
    theme_light: 'Light',
    theme_system: 'Follow System',
    language: 'Language / Idioma',
    hotkey_title: 'Global Overlay Hotkey',
    hotkey_desc: 'Press Shift + F12 at any time during gameplay to toggle overlay on/off.',
    save_settings: 'Save Settings',
    close: 'Close',
    target_monitor_title: 'Overlay Display (Monitor)',
    target_monitor_desc: 'Choose which display to show the in-game overlay on',
    monitor_auto_follow: 'Auto (Follow Game Screen)',
    monitor_primary: 'Primary',
    auto_show_game_title: 'Auto-show in Fullscreen Games',
    auto_show_game_desc: 'Automatically open the overlay when a fullscreen game starts',
    auto_hide_game_title: 'Auto-hide on Game Exit',
    auto_hide_game_desc: 'Automatically close the overlay when leaving the game',
    hw_displays: 'Connected Displays',
    hw_multiple_gpus: 'Graphics Cards (GPUs)',

    overlay_cpu: 'CPU',
    overlay_cpu_temp: 'CPU',
    overlay_gpu: 'GPU',
    overlay_gpu_temp: 'GPU',
    overlay_memory: 'RAM',
    overlay_vram: 'VRAM',
    overlay_fps: 'FPS',
    overlay_frame_time: 'FT',
    overlay_fps_1pct: '1% LOW',
    overlay_network: 'NET',
    overlay_disk: 'DISK',
    overlay_cpu_freq: 'CPU CLK',
    overlay_gpu_freq: 'GPU CLK',
    overlay_gpu_power: 'GPU W',

    monitor_page_title: 'In-Game Performance Monitor',
    monitor_status: 'Monitor Status',
    status_enabled: 'Enabled',
    status_disabled: 'Disabled',
    hotkey_activation: 'Activation Hotkey',
    hotkey_press_hint: 'Press Shift + F12 anytime to toggle the in-game overlay.',
    game_area: 'Game Screen Area',
    current_config: 'Current Configuration',
    help_how_to: 'How to adjust overlay settings?',
    help_how_to_desc: 'Click the settings gear icon at the top to change position, metrics, opacity or language.',

    hw_overview: 'Hardware Overview',
    hw_processor: 'Processor (CPU)',
    hw_gpu: 'Graphics Card (GPU)',
    hw_memory: 'Memory (RAM)',
    hw_storage: 'Storage',
    hw_display: 'Display',
    hw_copy_info: 'Copy Details',
    hw_copied: 'Copied!',
    hw_cores_threads: 'Cores / Threads',
    hw_freq: 'Frequency',
    hw_usage: 'Current Usage',
    hw_vram: 'Total VRAM',
    hw_driver: 'Driver Version',
    hw_capacity: 'Total Capacity',
    hw_used: 'Used',
    hw_available: 'Available',
    hw_resolution: 'Resolution',
    hw_refresh_rate: 'Refresh Rate',
    hw_load: 'Load',
    hw_temp: 'Temperature',
    hw_gpu_load: 'GPU Load',
    hw_vram_load: 'VRAM Load',
    hw_mem_load: 'Memory Load',
    hw_read_speed: 'Read',
    hw_write_speed: 'Write',
    hw_pawnio_hint: 'Install PawnIO driver to enable CPU temperature readings.',
    hw_expand_more: 'Click to expand',

    about_title: 'About NanoStat Custom',
    about_desc: 'Lightweight, modern hardware monitor and in-game overlay for Windows.',
    about_version: 'Version',
    about_author: 'Original Developer: Chunyu33 | Custom Fork',
    about_open_source: 'Open Source under MIT License',
  },

  'zh': {
    app_name: 'NanoStat',
    nav_hardware: '硬件信息',
    nav_monitor: '游戏内监控',
    nav_about: '关于',
    title_settings: '设置',
    title_minimize: '最小化',
    title_maximize: '最大化',
    title_close: '关闭到托盘',
    refresh: '刷新',
    loading: '加载中...',

    settings_dialog_title: '设置',
    overlay_toggle_title: '游戏内监控',
    overlay_toggle_desc: '在游戏中显示硬件性能监控面板',
    panel_position: '面板位置',
    pos_TopCenter: '顶部中间',
    pos_TopLeft: '左上角',
    pos_TopRight: '右上角',
    pos_BottomCenter: '底部中间',
    pos_BottomLeft: '左下角',
    pos_BottomRight: '右下角',
    pos_LeftCenter: '左侧中间',
    pos_RightCenter: '右侧中间',

    display_items: '显示项目',
    item_cpu: 'CPU 使用率',
    item_cpu_temp: 'CPU 温度',
    item_gpu: 'GPU 使用率',
    item_gpu_temp: 'GPU 温度',
    item_memory: '内存使用率',
    item_network: '网络速率',
    item_fps: '帧率 (FPS)',
    item_frame_time: '帧时间 (ms)',
    item_fps_1pct: '1% Low 帧率',
    item_vram: '显存占用',
    item_disk: '磁盘读写',
    item_cpu_freq: 'CPU 频率',
    item_gpu_freq: 'GPU 频率',
    item_gpu_power: 'GPU 功耗',

    refresh_interval: '刷新间隔',
    bg_opacity: '背景透明度',
    bg_opacity_desc: '仅调整监控面板背景透明度，文字与数值保持清晰可见。',
    font_size: '文字大小',
    font_size_desc: '面板文字大小（10-20px），悬浮窗口尺寸会随之自适应。',
    theme: '主题',
    theme_dark: '深色',
    theme_light: '浅色',
    theme_system: '跟随系统',
    language: '语言 / Language',
    hotkey_title: '全局快捷键',
    hotkey_desc: '游戏中随时按 Shift + F12 快速显示或隐藏监控悬浮窗。',
    save_settings: '保存设置',
    close: '关闭',
    target_monitor_title: '悬浮窗所在屏幕 (显示器)',
    target_monitor_desc: '选择游戏监控悬浮窗在哪个显示器上显示',
    monitor_auto_follow: '自动 (跟随游戏屏幕)',
    monitor_primary: '主屏幕',
    auto_show_game_title: '全屏游戏自动开启',
    auto_show_game_desc: '检测到全屏游戏运行时自动显示悬浮窗',
    auto_hide_game_title: '退出游戏自动隐藏',
    auto_hide_game_desc: '退出全屏游戏时自动关闭悬浮窗',
    hw_displays: '连接的显示器',
    hw_multiple_gpus: '显卡列表 (GPUs)',

    overlay_cpu: 'CPU',
    overlay_cpu_temp: 'CPU温度',
    overlay_gpu: 'GPU',
    overlay_gpu_temp: 'GPU温度',
    overlay_memory: '内存',
    overlay_vram: '显存',
    overlay_fps: 'FPS',
    overlay_frame_time: '帧时间',
    overlay_fps_1pct: '1%Low',
    overlay_network: '网络',
    overlay_disk: '磁盘',
    overlay_cpu_freq: 'CPU频率',
    overlay_gpu_freq: 'GPU频率',
    overlay_gpu_power: 'GPU功耗',

    monitor_page_title: '游戏内性能监控',
    monitor_status: '监控状态',
    status_enabled: '已启用',
    status_disabled: '已禁用',
    hotkey_activation: '激活快捷键',
    hotkey_press_hint: '按 Shift + F12 随时开启或关闭悬浮窗。',
    game_area: '游戏画面区域',
    current_config: '当前配置',
    help_how_to: '如何修改设置？',
    help_how_to_desc: '点击标题栏右侧的设置按钮，可调整面板位置、显示项目、刷新间隔、透明度与文字大小。',

    hw_overview: '硬件概览',
    hw_processor: '处理器 (CPU)',
    hw_gpu: '显卡 (GPU)',
    hw_memory: '内存 (RAM)',
    hw_storage: '存储设备',
    hw_display: '显示器',
    hw_copy_info: '复制信息',
    hw_copied: '已复制！',
    hw_cores_threads: '核心 / 线程',
    hw_freq: '频率',
    hw_usage: '当前使用率',
    hw_vram: '显存总量',
    hw_driver: '驱动版本',
    hw_capacity: '总容量',
    hw_used: '已用',
    hw_available: '可用',
    hw_resolution: '分辨率',
    hw_refresh_rate: '刷新率',
    hw_load: '占用',
    hw_temp: '温度',
    hw_gpu_load: '显卡占用',
    hw_vram_load: '显存占用',
    hw_mem_load: '内存占用',
    hw_read_speed: '读取',
    hw_write_speed: '写入',
    hw_pawnio_hint: '安装 PawnIO 驱动后重启应用即可读取 CPU 温度。',
    hw_expand_more: '点击展开更多',

    about_title: '关于 NanoStat Custom',
    about_desc: '轻量级、现代化的 Windows 硬件监控工具及游戏内悬浮窗。',
    about_version: '版本',
    about_author: '原开发者: Chunyu33 | 定制版',
    about_open_source: '基于 MIT 协议开源',
  },
};
