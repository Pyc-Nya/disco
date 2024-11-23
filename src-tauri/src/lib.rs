use std::fs;
use std::env;

#[tauri::command]
fn read_result() -> Result<i32, String> {
    // Получаем путь к директории пользователя
    let home_dir = env::var("USERPROFILE").unwrap_or_else(|_| String::from("C:\\"));
    let file_path = format!("{}/result.txt", home_dir); // Путь в директории пользователя

    match fs::read_to_string(file_path) {
        Ok(content) => {
            // Преобразуем строку в i32
            content.trim().parse::<i32>().map_err(|e| format!("Ошибка парсинга: {}", e))
        }
        Err(e) => Err(format!("Ошибка чтения файла: {}", e)),
    }
}

#[tauri::command]
fn save_result(result: i32) -> Result<(), String> {
    // Получаем путь к директории пользователя
    let home_dir = env::var("USERPROFILE").unwrap_or_else(|_| String::from("C:\\"));
    let file_path = format!("{}/result.txt", home_dir); // Путь в директории пользователя

    fs::write(file_path, result.to_string())
        .map_err(|e| format!("Не удалось записать в файл: {}", e))?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_result, read_result])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
