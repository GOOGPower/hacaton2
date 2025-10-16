from flask import Flask, send_from_directory, send_file
import os
from pathlib import Path

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

if __name__ == '__main__':
    PORT = 3000
    print(f'Server running on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=True)