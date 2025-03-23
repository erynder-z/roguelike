use std::fs::File;
use std::io::Read;
use ttf_parser::{name_id, Face};
use walkdir::WalkDir;

#[derive(serde::Serialize)]
pub struct FontInfo {
    name: String,
    path: String,
}

#[tauri::command]
pub fn get_fonts_from_directory(dir: String) -> Result<Vec<FontInfo>, String> {
    let mut fonts = Vec::new();

    for entry in WalkDir::new(&dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.path().extension().and_then(|s| s.to_str()) == Some("ttf"))
    {
        let path = entry.path().to_path_buf();
        let mut buffer = Vec::new();
        File::open(&path)
            .and_then(|mut f| f.read_to_end(&mut buffer))
            .map_err(|e| e.to_string())?;

        if let Ok(face) = Face::parse(&buffer, 0) {
            let mut font_name = None;

            for name in face.names() {
                if name.name_id == name_id::FULL_NAME {
                    if let Some(name_string) = name.to_string() {
                        font_name = Some(name_string);
                        break;
                    }
                }
            }

            if let Some(name) = font_name {
                fonts.push(FontInfo {
                    name,
                    path: path.to_string_lossy().to_string(),
                });
            }
        }
    }

    Ok(fonts)
}
