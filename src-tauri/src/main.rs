#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::window_commands::show_main_window,
            commands::window_commands::show_help_window,
            commands::window_commands::hide_help_window,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
