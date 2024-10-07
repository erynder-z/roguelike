// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

#[tauri::command]
fn show_main_window(app: AppHandle) {
    let main_window = app.get_webview_window("main").unwrap();
    main_window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![show_main_window])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
