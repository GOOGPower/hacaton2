from flask import Flask, send_from_directory, send_file, request
from pathlib import Path
import requests

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
    #date = request.values.get("date")
    data = request.json
    if not data["date"]:
        return {"error": "Не указано дата"}, 400
    url = "http://api.weatherapi.com/v1/history.json"
    params = {
        "key":"e235d74bdbe54bb6853113423251710",
        "q":"56.874997, 53.320067",
        "dt":data["date"]
    }
    response = requests.get(url, params=params)
    data = response.json()["forecast"]["forecastday"][0]["day"]
    
    return data

@app.route("/api/types_of_work_and_amount_peoples", methods=["GET"])
def get_work():
    api = GoogleSheetsAPI("1PyfwsbPyT4HgM85RLewMiBXoKa9Rn72NM_6fSQRzi7c")
    data = api.get_columns_data(999492005)
    i = 12
    dist = {}
    for i1 in range(3, len(data[1])):
        if data[0][i1] == "" and data[12][i1] != "":
            i = 12
            dist[data[1][i1]] = []
            while i<38:
                dist[data[1][i1]].append(data[i][i1])
                i+=8
    return dist



if __name__ == '__main__':
    PORT = 3000
    print(f'Server running on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=True)