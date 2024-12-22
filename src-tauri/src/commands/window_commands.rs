use tauri::{Manager, Runtime, WebviewUrl, WebviewWindowBuilder};

async fn manage_window<R: Runtime>(
    app: &tauri::AppHandle<R>,
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
pub async fn focus_window<R: Runtime>(
    app: &tauri::AppHandle<R>,
    label: &str,
) -> Result<(), String> {
    let window = app
        .get_webview_window(label)
        .ok_or_else(|| format!("No window found with label: {}", label))?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn show_main_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    manage_window(&app, "main", true).await
}

#[tauri::command]
pub async fn focus_main_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    focus_window(&app, "main").await
}

#[tauri::command]
pub async fn close_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    let help_window = app.get_webview_window("help");
    if let Some(window) = help_window {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn create_hidden_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    let window = WebviewWindowBuilder::new(&app, "help", WebviewUrl::App("help.html".into()))
        .title("Meikai - Help")
        .fullscreen(true)
        .build()
        .map_err(|e| e.to_string())?;

    window.hide().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn show_hidden_help_window<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    let window = app
        .get_webview_window("help")
        .ok_or_else(|| "Help window not found".to_string())?;

    window.show().map_err(|e| e.to_string())?;
    Ok(())
}
