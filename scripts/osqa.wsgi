import os, sys
sys.path.append('/Applications/osqa-1.0rc-3/apps')
sys.path.append('/Applications/osqa-1.0rc-3/apps/osqa')
os.environ['DJANGO_SETTINGS_MODULE'] = 'osqa.settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
