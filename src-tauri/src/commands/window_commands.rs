use tauri::{Manager, Runtime};

async fn manage_window<R: Runtime>(
    app: tauri::AppHandle<R>,
    label: &str,
    show: bool,
) -> Result<(), String> {
    let window = app
        .get_webview_window(label)
        .ok_or_else(|| format!("No window found with label: {}", label))?;

    if show {
        window.show().map_err(|e| e.to_string())?;
    } else {
        window.hide().map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn show_main_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "main", true).await
}

#[tauri::command]
pub async fn show_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "help", true).await
}

#[tauri::command]
pub async fn hide_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(app, "help", false).await
}
