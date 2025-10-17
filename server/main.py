from flask import Flask, send_from_directory, send_file
import os
from pathlib import Path
import requests
import json
from datetime import datetime, timezone
from google_sheets_lib import (
    GoogleSheetsAPI, 
    load_sheet_as_columns, 
    load_sheet_as_dict, 
    load_sheet_as_rows,
    get_sheet_headers
)

class WeatherAPI:
    """Класс для работы с OpenWeatherMap API"""
    
    def __init__(self, api_key="bf7e174f4a74e42a08555fb731d7ee29"):
        self.api_key = api_key
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    def get_current_weather(self, city):
        """Получить текущую погоду для города"""
        url = f"{self.base_url}/weather"
        params = {
            'q': city,
            'appid': self.api_key,
            'units': 'metric',  # Цельсий
            'lang': 'ru'  # Русский язык
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Ошибка запроса: {str(e)}"}
    
    def get_weather_by_coordinates(self, lat, lon):
        """Получить погоду по координатам"""
        url = f"{self.base_url}/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': self.api_key,
            'units': 'metric',
            'lang': 'ru'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Ошибка запроса: {str(e)}"}
    
    def get_forecast(self, city, days=5):
        """Получить прогноз погоды на несколько дней"""
        url = f"{self.base_url}/forecast"
        params = {
            'q': city,
            'appid': self.api_key,
            'units': 'metric',
            'lang': 'ru',
            'cnt': days * 8  # 8 записей в день (каждые 3 часа)
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Ошибка запроса: {str(e)}"}
    
    def get_coordinates_by_city(self, city):
        """Получить координаты города для исторических запросов"""
        weather_data = self.get_current_weather(city)
        if "error" in weather_data:
            return weather_data
        
        try:
            return {
                "lat": weather_data["coord"]["lat"],
                "lon": weather_data["coord"]["lon"],
                "city": weather_data["name"],
                "country": weather_data["sys"]["country"]
            }
        except KeyError as e:
            return {"error": f"Ошибка получения координат: {str(e)}"}
    
    def get_historical_weather(self, city, date):
        """
        Получить историческую погоду для города на определенную дату
        date может быть строкой в формате 'YYYY-MM-DD' или объектом datetime
        """
        # Получаем координаты города
        coords = self.get_coordinates_by_city(city)
        if "error" in coords:
            return coords
        
        return self.get_historical_weather_by_coordinates(coords["lat"], coords["lon"], date)
    
    def get_historical_weather_by_coordinates(self, lat, lon, date):
        """
        Получить историческую погоду по координатам на определенную дату
        date может быть строкой в формате 'YYYY-MM-DD' или объектом datetime
        """
        # Преобразуем дату в timestamp
        if isinstance(date, str):
            try:
                date_obj = datetime.strptime(date, '%Y-%m-%d')
            except ValueError:
                return {"error": "Неверный формат даты. Используйте YYYY-MM-DD"}
        elif isinstance(date, datetime):
            date_obj = date
        else:
            return {"error": "Дата должна быть строкой в формате YYYY-MM-DD или объектом datetime"}
        
        # Устанавливаем время на полдень UTC для получения данных за день
        date_obj = date_obj.replace(hour=12, minute=0, second=0, microsecond=0)
        timestamp = int(date_obj.timestamp())
        
        # Проверяем, что дата не в будущем
        current_timestamp = int(datetime.now().timestamp())
        if timestamp > current_timestamp:
            return {"error": "Нельзя получить исторические данные для будущей даты"}
        
        # Проверяем, что дата не старше 5 дней (ограничение бесплатного API)
        five_days_ago = current_timestamp - (5 * 24 * 60 * 60)
        if timestamp < five_days_ago:
            return {"error": "Бесплатный API позволяет получать данные только за последние 5 дней"}
        
        url = f"{self.base_url}/onecall/timemachine"
        params = {
            'lat': lat,
            'lon': lon,
            'dt': timestamp,
            'appid': self.api_key,
            'units': 'metric',
            'lang': 'ru'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Ошибка запроса исторических данных: {str(e)}"}
    
    def get_weather_for_date_range(self, city, start_date, end_date):
        """
        Получить погоду для города за период времени
        start_date и end_date - строки в формате 'YYYY-MM-DD'
        """
        # Получаем координаты города
        coords = self.get_coordinates_by_city(city)
        if "error" in coords:
            return coords
        
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return {"error": "Неверный формат даты. Используйте YYYY-MM-DD"}
        
        if start_dt > end_dt:
            return {"error": "Начальная дата не может быть позже конечной"}
        
        # Собираем данные за каждый день
        weather_data = []
        current_date = start_dt
        
        while current_date <= end_dt:
            daily_weather = self.get_historical_weather_by_coordinates(
                coords["lat"], coords["lon"], current_date
            )
            
            if "error" not in daily_weather:
                weather_data.append({
                    "date": current_date.strftime('%Y-%m-%d'),
                    "weather": daily_weather
                })
            else:
                weather_data.append({
                    "date": current_date.strftime('%Y-%m-%d'),
                    "error": daily_weather["error"]
                })
            
            # Переходим к следующему дню
            current_date = datetime(current_date.year, current_date.month, current_date.day + 1)
            if current_date.day == 1:  # Переход на следующий месяц
                if current_date.month == 12:
                    current_date = datetime(current_date.year + 1, 1, 1)
                else:
                    current_date = datetime(current_date.year, current_date.month + 1, 1)
        
    def get_weather_for_date_range_by_coordinates(self, lat, lon, start_date, end_date):
        """
        Получить погоду по координатам за период времени
        lat, lon - координаты места
        start_date и end_date - строки в формате 'YYYY-MM-DD'
        """
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return {"error": "Неверный формат даты. Используйте YYYY-MM-DD"}
        
        if start_dt > end_dt:
            return {"error": "Начальная дата не может быть позже конечной"}
        
        # Собираем данные за каждый день
        weather_data = []
        current_date = start_dt
        
        while current_date <= end_dt:
            daily_weather = self.get_historical_weather_by_coordinates(lat, lon, current_date)
            
            if "error" not in daily_weather:
                weather_data.append({
                    "date": current_date.strftime('%Y-%m-%d'),
                    "weather": daily_weather
                })
            else:
                weather_data.append({
                    "date": current_date.strftime('%Y-%m-%d'),
                    "error": daily_weather["error"]
                })
            
            # Переходим к следующему дню
            current_date = datetime(current_date.year, current_date.month, current_date.day + 1)
            if current_date.day == 1:  # Переход на следующий месяц
                if current_date.month == 12:
                    current_date = datetime(current_date.year + 1, 1, 1)
                else:
                    current_date = datetime(current_date.year, current_date.month + 1, 1)
        
        return {
            "coordinates": f"{lat}, {lon}",
            "period": f"{start_date} - {end_date}",
            "data": weather_data
        }
    
    def format_weather_data(self, weather_data):
        """Форматировать данные о погоде для удобного отображения"""
        if "error" in weather_data:
            return weather_data
        
        try:
            formatted = {
                "город": weather_data["name"],
                "страна": weather_data["sys"]["country"],
                "температура": weather_data["main"]["temp"],
                "ощущается_как": weather_data["main"]["feels_like"],
                "описание": weather_data["weather"][0]["description"],
                "влажность": weather_data["main"]["humidity"],
                "давление": weather_data["main"]["pressure"],
                "скорость_ветра": weather_data.get("wind", {}).get("speed", 0),
                "облачность": weather_data["clouds"]["all"]
            }
            return formatted
        except KeyError as e:
            return {"error": f"Ошибка обработки данных: {str(e)}"}
    
    def format_historical_weather_data(self, historical_data):
        """Форматировать исторические данные о погоде для удобного отображения"""
        if "error" in historical_data:
            return historical_data
        
        try:
            # Для исторических данных структура немного отличается
            current = historical_data.get("current", {})
            
            formatted = {
                "дата": datetime.fromtimestamp(current["dt"]).strftime('%Y-%m-%d %H:%M'),
                "температура": current["temp"],
                "ощущается_как": current["feels_like"],
                "описание": current["weather"][0]["description"],
                "влажность": current["humidity"],
                "давление": current["pressure"],
                "скорость_ветра": current.get("wind_speed", 0),
                "облачность": current["clouds"],
                "видимость": current.get("visibility", 0),
                "uv_индекс": current.get("uvi", 0)
            }
            return formatted
        except (KeyError, IndexError) as e:
            return {"error": f"Ошибка обработки исторических данных: {str(e)}"}

# Создаем экземпляр класса для работы с погодой
weather_api = WeatherAPI()

app = Flask(__name__)

# Определяем путь к папке dist (аналогично Node.js коду)
BASE_DIR = Path(__file__).parent.parent
DIST_PATH = BASE_DIR / 'dist'

print(f'Serving static files from: {DIST_PATH}')

@app.route('/')
def index():
    """Главная страница - возвращаем index.html"""
    return send_file(DIST_PATH / 'index.html')

@app.route('/<path:filename>')
def serve_static_or_spa(filename):
    """
    Обработка всех остальных маршрутов:
    1. Если файл существует - возвращаем его
    2. Если это папка без расширения - возвращаем index.html (для SPA routing)
    """
    file_path = DIST_PATH / filename
    
    # Если файл существует, возвращаем его
    if file_path.is_file():
        return send_file(file_path)
    
    # Если это директория, ищем index.html в ней
    if file_path.is_dir():
        index_file = file_path / 'index.html'
        if index_file.exists():
            return send_file(index_file)
    
    # Если файл не найден и у пути нет расширения (SPA route)
    if '.' not in filename.split('/')[-1]:
        return send_file(DIST_PATH / 'index.html')
    
    # Если ничего не подошло, возвращаем 404
    return "File not found", 404

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Специальный маршрут для папки assets"""
    return send_from_directory(DIST_PATH / 'assets', filename)

@app.route("/api/weather", methods=["POST"])
def get_weather():
    date = request.form["date"]
    if not date:
        return {"error": "Не указано дата"}, 400
    
    weather = weather_api.get_weather(date)
    return weather

@app.route("/api/types_of_work", methods=["POST"])
def get_work():
    api = GoogleSheetsAPI(SHEET_ID)
    data_array = api.get_columns_data(SHEET_GID)
    i = 307
    f = ""
    dist = {}
    while i<385:
        if data_array[1][i] != "2 этап планирования":
            try:
                float(data_array[3][i].replace(",","."))
                print(data_array[1][i])
                f = data_array[1][i]
                dist[f] = []
                
            except:
                dist[f].append(data_array[1][i])
                print(f"  - {data_array[1][i]}")
        i+=1
    return dist



if __name__ == '__main__':
    PORT = 3000
    print(f'Server running on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=True)