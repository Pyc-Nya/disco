use std::fs;
use std::env;
use std::path::{Path, PathBuf};
use directories_next::ProjectDirs;
use lazy_static::lazy_static;
use log::{info, LevelFilter};
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

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
#[specta::specta]
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
#[specta::specta]
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
    #[cfg(target_os = "android")]
    android_logger::init_once(
        android_logger::Config::default().with_max_level(LevelFilter::Trace)
    );

    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![read_result, save_result]);

    #[cfg(all(debug_assertions, not(target_os = "android")))] // <- Only export on non-release builds
    builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        // and finally tell Tauri how to invoke them
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            // This is also required if you want to use events
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
