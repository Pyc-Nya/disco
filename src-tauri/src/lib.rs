use std::fs;
use std::env;
use std::path::{Path, PathBuf};
use directories_next::ProjectDirs;
use lazy_static::lazy_static;
use log::info;

#[cfg(not(target_os="android"))]
lazy_static! {
    static ref APP_DIR: ProjectDirs = ProjectDirs::from("com", "example", "disco").unwrap();
    static ref DATA_DIR: PathBuf = APP_DIR.data_dir().to_path_buf();
}
#[cfg(target_os="android")]
lazy_static! {
    static ref DATA_DIR: PathBuf = PathBuf::from("/data/data/com.clicker.app/files/");
}

#[tauri::command]
fn read_result() -> Result<i32, String> {
    let file_path = Path::join(&DATA_DIR, "result.txt");
    let result = fs::read_to_string(file_path)
        .map_err(|e| e.to_string())?;
    let result = result.trim().parse()
        .map_err(|e: std::num::ParseIntError| e.to_string())?;
    info!("Read result: {}", result);
    Ok(result)
}

#[tauri::command]
fn save_result(result: i32) -> Result<(), String> {
    let file_path = Path::join(&DATA_DIR, "result.txt");
    fs::create_dir_all(&*DATA_DIR).unwrap();
    info!("Saving result to {:?}", file_path);
    fs::write(file_path, result.to_string())
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_result, read_result])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
