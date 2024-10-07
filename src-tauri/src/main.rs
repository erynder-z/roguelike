#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Runtime};

async fn manage_window<R: Runtime>(
    app: tauri::AppHandle<R>,
    label: &str,
    show: bool,
) -> Result<(), String> {
    let window = app
        .get_webview_window(label)
        .ok_or(format!("No window found with label: {}", label))?;

    if show {
        window.show().map_err(|e| e.to_string())?;
    } else {
        window.hide().map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
async fn show_main_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "main", true).await
}

#[tauri::command]
async fn show_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "help", true).await
}

#[tauri::command]
async fn hide_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "help", false).await
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            show_main_window,
            show_help_window,
            hide_help_window,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
