import os
from uuid import uuid4
from PIL import Image
import io
from loguru import logger

from advanced_http_request_handler import AdvancedHTTPRequestHandler
from settings import IMAGES_PATH, \
    ALLOWED_EXTENSIONS, MAX_FILE_SIZE, ERROR_FILE


class ImageHostingHttpRequestHandler(AdvancedHTTPRequestHandler):
    server_version = 'Image Hosting Server v0.1'

    def __init__(self, request, client_address, server):

        self.get_routes = {
            '/api/images/': self.get_images
        }
        self.post_routes = {
            '/upload/': self.post_upload
        }
        self.delete_routes = {
            '/api/delete/': self.delete_image
        }
        self.terms_routes = {
            '/terms': self.get_terms
        }
        super().__init__(request, client_address, server)

    def get_images(self):
        self.send_json({
            'images': next(os.walk(IMAGES_PATH))[2]
        })

    def post_upload(self):
        length = int(self.headers.get('Content-Length'))
        if length > MAX_FILE_SIZE:
            logger.warning('File too large')
            self.send_error(413, "File too large")
            return

        data = self.rfile.read(length)
        _, ext = os.path.splitext(self.headers.get('Filename'))
        image_id = uuid4()
        if ext not in ALLOWED_EXTENSIONS:
            logger.warning('File type not allowed')
            self.send_error(400, "File type not allowed")
            return
        if not is_valid_image(data):
            self.send_error(400, "This is not an image file" )  # Не изображение
            return

        with open(IMAGES_PATH + f'{image_id}{ext}', 'wb') as file:
            file.write(data)
        self.send_json({'file_length': {length}}, headers={
            'Location': f'http://localhost/{IMAGES_PATH}{image_id}{ext}'})

    def delete_image(self):
        image_id = self.headers.get('Filename')
        if not image_id:
            logger.warning('Image not found')
            self.send_html(ERROR_FILE, 404)
            return

        image_path = IMAGES_PATH + image_id
        if not os.path.exists(image_path):
            logger.warning('Image not found')
            self.send_html(ERROR_FILE, 404)
            return

        os.remove(image_path)
        self.send_json({'Success': 'Image deleted'})


    def get_terms(self):
        self.send_html('terms.html', 200)

def is_valid_image(file_data: bytes) -> bool:
    """Является ли загруженный файл изображением."""
    try:
        image = Image.open(io.BytesIO(file_data))
        image.verify()  # Проверяет целостность файла
        return True
    except (IOError, SyntaxError):
        return False
