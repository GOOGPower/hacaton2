from google_sheets_lib import GoogleSheetsAPI, load_sheet_as_columns

# 1. Сделайте таблицу общедоступной
# 2. Получите ID таблицы из URL
SHEET_ID = "1DE1GC--qpXpc1f1yLqgzro1ixqlOzbHkdRrqMAtVTpg" 
SHEET_GID = 75017674  # GID листа

try:
    print("Использование библиотеки GoogleSheetsAPI...")
    
    # Способ 1: Использование класса API
    api = GoogleSheetsAPI(SHEET_ID)
    
    # Получение заголовков
    headers = api.get_headers(SHEET_GID)
    print(f"Заголовки: {headers}")
    
    # Получение данных в формате списка столбцов
    data_array = api.get_columns_data(SHEET_GID)
    
    print("Данные преобразованы в список значений по столбцам:")
    for i, column_values in enumerate(data_array):
        print(f"Столбец {i} ({headers[i]}): {len(column_values)} значений")
        print(f"  Первые 3 значения: {column_values[:3]}")
    
    print(f"\nМассив данных готов к использованию: {len(data_array)} столбцов")
    
    # Способ 2: Использование функции быстрого доступа
    print("\n" + "="*50)
    print("Альтернативный способ через функцию:")
    data_array_alt = load_sheet_as_columns(SHEET_ID, SHEET_GID)
    print(f"Загружено столбцов: {len(data_array_alt)}")
    
except Exception as e:
    print(f"Ошибка: {e}")