import os
import sys
from a2wsgi import ASGIMiddleware

sys.path.insert(0, os.path.dirname(__file__))

from main import app

application = ASGIMiddleware(app)