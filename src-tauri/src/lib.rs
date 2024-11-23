use std::fs;

#[tauri::command]
fn read_result() -> Result<i32, String> {
    let file_path = "result.txt"; // Путь к файлу
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
    let file_path = "result.txt";
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
