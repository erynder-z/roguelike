// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

#[tauri::command]
async fn close_splashscreen(app: AppHandle) {
    let splash_window = app.get_webview_window("splashscreen").unwrap();
    let main_window = app.get_webview_window("main").unwrap();

    splash_window.close().unwrap();
    main_window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
