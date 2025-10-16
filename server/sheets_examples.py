"""
Примеры использования библиотеки GoogleSheetsAPI
"""

from google_sheets_lib import (
    GoogleSheetsAPI, 
    load_sheet_as_columns, 
    load_sheet_as_dict, 
    load_sheet_as_rows,
    get_sheet_headers
)

# Конфигурация
SHEET_ID = "1DE1GC--qpXpc1f1yLqgzro1ixqlOzbHkdRrqMAtVTpg"
SHEET_GID = 75017674


def example_api_class():
    """Пример использования класса GoogleSheetsAPI"""
    print("=== Использование класса GoogleSheetsAPI ===")
    
    try:
        # Создание API клиента
        api = GoogleSheetsAPI(SHEET_ID)
        
        # Получение заголовков
        headers = api.get_headers(SHEET_GID)
        print(f"Заголовки: {headers}")
        
        # Получение данных в разных форматах
        print("\n1. Данные как список столбцов:")
        columns_data = api.get_columns_data(SHEET_GID)
        print(f"   Количество столбцов: {len(columns_data)}")
        if columns_data and headers:
            print(f"   Первый столбец '{headers[0]}': {columns_data[0][:3]}...")
        
        print("\n2. Данные как словарь столбцов:")
        dict_data = api.get_dict_data(SHEET_GID)
        print(f"   Столбцы: {list(dict_data.keys())}")
        if dict_data:
            first_key = list(dict_data.keys())[0]
            print(f"   Первые значения '{first_key}': {dict_data[first_key][:3]}...")
        
        print("\n3. Данные как список строк:")
        rows_data = api.get_rows_data(SHEET_GID)
        print(f"   Количество строк: {len(rows_data)}")
        if rows_data:
            print(f"   Первая строка: {rows_data[0]}")
            
    except Exception as e:
        print(f"Ошибка: {e}")


def example_quick_functions():
    """Пример использования функций быстрого доступа"""
    print("\n=== Функции быстрого доступа ===")
    
    try:
        # Быстрое получение заголовков
        headers = get_sheet_headers(SHEET_ID, SHEET_GID)
        print(f"Заголовки: {headers}")
        
        # Быстрое получение данных в разных форматах
        print("\n1. load_sheet_as_columns:")
        columns = load_sheet_as_columns(SHEET_ID, SHEET_GID)
        print(f"   Столбцов: {len(columns)}")
        
        print("\n2. load_sheet_as_dict:")
        data_dict = load_sheet_as_dict(SHEET_ID, SHEET_GID)
        print(f"   Ключи: {list(data_dict.keys())}")
        
        print("\n3. load_sheet_as_rows:")
        rows = load_sheet_as_rows(SHEET_ID, SHEET_GID)
        print(f"   Строк: {len(rows)}")
        
    except Exception as e:
        print(f"Ошибка: {e}")


def example_data_processing():
    """Пример обработки данных"""
    print("\n=== Обработка данных ===")
    
    try:
        api = GoogleSheetsAPI(SHEET_ID)
        
        # Получение данных как словарь для удобной обработки
        data = api.get_dict_data(SHEET_GID)
        
        print("Анализ данных:")
        for column_name, values in data.items():
            non_empty = [v for v in values if v != '']
            print(f"\nСтолбец '{column_name}':")
            print(f"  - Всего значений: {len(values)}")
            print(f"  - Непустых: {len(non_empty)}")
            print(f"  - Заполненность: {len(non_empty)/len(values)*100:.1f}%")
            
            # Показать примеры значений
            if non_empty:
                unique_values = list(set(non_empty))
                if len(unique_values) <= 5:
                    print(f"  - Уникальные значения: {unique_values}")
                else:
                    print(f"  - Примеры значений: {unique_values[:3]}...")
                    
    except Exception as e:
        print(f"Ошибка: {e}")


def example_different_formats():
    """Пример работы с разными форматами данных"""
    print("\n=== Сравнение форматов данных ===")
    
    try:
        api = GoogleSheetsAPI(SHEET_ID)
        
        # Получение данных в разных форматах
        columns_format = api.get_columns_data(SHEET_GID)
        dict_format = api.get_dict_data(SHEET_GID)
        rows_format = api.get_rows_data(SHEET_GID)
        headers = api.get_headers(SHEET_GID)
        
        print(f"Заголовки: {headers}")
        print(f"Количество столбцов: {len(headers)}")
        
        # Демонстрация доступа к данным
        if columns_format and dict_format and rows_format:
            print("\nДоступ к первому значению первого столбца:")
            print(f"  columns_format[0][0] = {columns_format[0][0]}")
            print(f"  dict_format['{headers[0]}'][0] = {dict_format[headers[0]][0]}")
            print(f"  rows_format[0]['{headers[0]}'] = {rows_format[0][headers[0]]}")
            
            print(f"\nВсе значения первого столбца:")
            print(f"  Через columns: {columns_format[0][:3]}...")
            print(f"  Через dict: {dict_format[headers[0]][:3]}...")
            
            print(f"\nПервая строка как объект:")
            print(f"  {rows_format[0]}")
            
    except Exception as e:
        print(f"Ошибка: {e}")


if __name__ == "__main__":
    # Запуск всех примеров
    example_api_class()
    example_quick_functions()
    example_data_processing()
    example_different_formats()
    
    print("\n=== Примеры завершены ===")
