import requests
import json
from typing import List, Dict, Any, Tuple, Optional


class GoogleSheetsAPI:
    """
    Библиотека для работы с Google Sheets через публичные таблицы
    """
    
    def __init__(self, sheet_id: str):
        """
        Инициализация API клиента
        
        Args:
            sheet_id (str): ID Google таблицы
        """
        self.sheet_id = sheet_id
    
    def _build_url(self, sheet_gid: int) -> str:
        """
        Формирование URL для получения данных в JSON формате
        
        Args:
            sheet_gid (int): GID листа Google таблицы
            
        Returns:
            str: URL для запроса данных
        """
        return f'https://docs.google.com/spreadsheets/d/{self.sheet_id}/gviz/tq?tqx=out:json&gid={sheet_gid}'
    
    def _fetch_raw_data(self, sheet_gid: int) -> str:
        """
        Получение сырых данных от Google Sheets
        
        Args:
            sheet_gid (int): GID листа
            
        Returns:
            str: Сырой JSON ответ
            
        Raises:
            requests.RequestException: Ошибка при HTTP запросе
        """
        url = self._build_url(sheet_gid)
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    
    def _clean_json_response(self, raw_response: str) -> str:
        """
        Очистка ответа Google Sheets от служебных префиксов
        
        Args:
            raw_response (str): Сырой ответ от Google Sheets
            
        Returns:
            str: Очищенный JSON текст
        """
        json_text = raw_response.replace('/*O_o*/\ngoogle.visualization.Query.setResponse(', '')
        json_text = json_text.rstrip(');')
        return json_text
    
    def _parse_sheets_data(self, json_text: str) -> Tuple[List[str], List[List[Any]]]:
        """
        Парсинг JSON данных от Google Sheets
        
        Args:
            json_text (str): Очищенный JSON текст
            
        Returns:
            tuple: (заголовки, данные_строк)
            
        Raises:
            json.JSONDecodeError: Ошибка при парсинге JSON
            ValueError: Неожиданная структура данных
        """
        data_json = json.loads(json_text)
        
        if 'table' not in data_json or 'rows' not in data_json['table']:
            raise ValueError("Неожиданная структура JSON данных")
        
        rows = data_json['table']['rows']
        cols = data_json['table']['cols']
        
        # Получение заголовков столбцов
        headers = [col.get('label', f'Column_{i}') for i, col in enumerate(cols)]
        
        # Извлечение данных строк
        data_rows = []
        for row in rows:
            row_data = []
            for cell in row.get('c', []):
                if cell is not None:
                    row_data.append(cell.get('v', ''))
                else:
                    row_data.append('')
            data_rows.append(row_data)
        
        return headers, data_rows
    
    def get_sheet_data(self, sheet_gid: int, format_type: str = 'columns') -> Any:
        """
        Получение данных из Google таблицы
        
        Args:
            sheet_gid (int): GID листа
            format_type (str): Формат возвращаемых данных ('columns', 'dict', 'rows')
            
        Returns:
            Any: Данные в указанном формате
            
        Raises:
            ValueError: Неподдерживаемый формат данных
        """
        try:
            # Получение и обработка данных
            raw_data = self._fetch_raw_data(sheet_gid)
            json_text = self._clean_json_response(raw_data)
            headers, data_rows = self._parse_sheets_data(json_text)
            
            # Возврат данных в нужном формате
            if format_type == 'columns':
                return self._format_as_columns(headers, data_rows)
            elif format_type == 'dict':
                return self._format_as_dict(headers, data_rows)
            elif format_type == 'rows':
                return self._format_as_rows(headers, data_rows)
            else:
                raise ValueError(f"Неподдерживаемый формат: {format_type}")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Ошибка при запросе: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Ошибка при парсинге JSON: {e}")
        except Exception as e:
            raise Exception(f"Общая ошибка: {e}. Проверьте ID и публичность таблицы.")
    
    def _format_as_columns(self, headers: List[str], data_rows: List[List[Any]]) -> List[List[Any]]:
        """
        Форматирование данных как список столбцов
        
        Args:
            headers (List[str]): Заголовки столбцов
            data_rows (List[List[Any]]): Данные строк
            
        Returns:
            List[List[Any]]: Список столбцов
        """
        data_array = []
        for i, header in enumerate(headers):
            column_values = []
            for row_data in data_rows:
                if i < len(row_data):
                    column_values.append(row_data[i])
                else:
                    column_values.append('')
            data_array.append(column_values)
        return data_array
    
    def _format_as_dict(self, headers: List[str], data_rows: List[List[Any]]) -> Dict[str, List[Any]]:
        """
        Форматирование данных как словарь столбцов
        
        Args:
            headers (List[str]): Заголовки столбцов
            data_rows (List[List[Any]]): Данные строк
            
        Returns:
            Dict[str, List[Any]]: Словарь столбцов
        """
        data_dict = {}
        for header in headers:
            data_dict[header] = []
        
        for row_data in data_rows:
            for i, value in enumerate(row_data):
                if i < len(headers):
                    data_dict[headers[i]].append(value)
        
        return data_dict
    
    def _format_as_rows(self, headers: List[str], data_rows: List[List[Any]]) -> List[Dict[str, Any]]:
        """
        Форматирование данных как список строк (объектов)
        
        Args:
            headers (List[str]): Заголовки столбцов
            data_rows (List[List[Any]]): Данные строк
            
        Returns:
            List[Dict[str, Any]]: Список объектов-строк
        """
        data_array = []
        for row_data in data_rows:
            row_dict = {}
            for i, value in enumerate(row_data):
                if i < len(headers):
                    row_dict[headers[i]] = value
            data_array.append(row_dict)
        return data_array
    
    def get_headers(self, sheet_gid: int) -> List[str]:
        """
        Получение только заголовков столбцов
        
        Args:
            sheet_gid (int): GID листа
            
        Returns:
            List[str]: Список заголовков
        """
        raw_data = self._fetch_raw_data(sheet_gid)
        json_text = self._clean_json_response(raw_data)
        headers, _ = self._parse_sheets_data(json_text)
        return headers
    
    def get_columns_data(self, sheet_gid: int) -> List[List[Any]]:
        """
        Получение данных в формате списка столбцов
        
        Args:
            sheet_gid (int): GID листа
            
        Returns:
            List[List[Any]]: Список столбцов
        """
        return self.get_sheet_data(sheet_gid, 'columns')
    
    def get_dict_data(self, sheet_gid: int) -> Dict[str, List[Any]]:
        """
        Получение данных в формате словаря столбцов
        
        Args:
            sheet_gid (int): GID листа
            
        Returns:
            Dict[str, List[Any]]: Словарь столбцов
        """
        return self.get_sheet_data(sheet_gid, 'dict')
    
    def get_rows_data(self, sheet_gid: int) -> List[Dict[str, Any]]:
        """
        Получение данных в формате списка строк
        
        Args:
            sheet_gid (int): GID листа
            
        Returns:
            List[Dict[str, Any]]: Список строк-объектов
        """
        return self.get_sheet_data(sheet_gid, 'rows')


# Функции для быстрого использования
def load_sheet_as_columns(sheet_id: str, sheet_gid: int) -> List[List[Any]]:
    """
    Быстрая загрузка данных в формате списка столбцов
    
    Args:
        sheet_id (str): ID Google таблицы
        sheet_gid (int): GID листа
        
    Returns:
        List[List[Any]]: Список столбцов
    """
    api = GoogleSheetsAPI(sheet_id)
    return api.get_columns_data(sheet_gid)


def load_sheet_as_dict(sheet_id: str, sheet_gid: int) -> Dict[str, List[Any]]:
    """
    Быстрая загрузка данных в формате словаря столбцов
    
    Args:
        sheet_id (str): ID Google таблицы
        sheet_gid (int): GID листа
        
    Returns:
        Dict[str, List[Any]]: Словарь столбцов
    """
    api = GoogleSheetsAPI(sheet_id)
    return api.get_dict_data(sheet_gid)


def load_sheet_as_rows(sheet_id: str, sheet_gid: int) -> List[Dict[str, Any]]:
    """
    Быстрая загрузка данных в формате списка строк
    
    Args:
        sheet_id (str): ID Google таблицы
        sheet_gid (int): GID листа
        
    Returns:
        List[Dict[str, Any]]: Список строк-объектов
    """
    api = GoogleSheetsAPI(sheet_id)
    return api.get_rows_data(sheet_gid)


def get_sheet_headers(sheet_id: str, sheet_gid: int) -> List[str]:
    """
    Быстрое получение заголовков столбцов
    
    Args:
        sheet_id (str): ID Google таблицы
        sheet_gid (int): GID листа
        
    Returns:
        List[str]: Список заголовков
    """
    api = GoogleSheetsAPI(sheet_id)
    return api.get_headers(sheet_gid)
