// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn exit_app() {
  std::process::exit(0x0);
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![exit_app])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
