# encoding:utf-8
import os.path

SITE_SRC_ROOT = os.path.dirname(__file__)
LOG_FILENAME = 'django.osqa.log'

#for logging
import logging
logging.basicConfig(
    filename=os.path.join(SITE_SRC_ROOT, 'log', LOG_FILENAME),
    level=logging.ERROR,
    format='%(pathname)s TIME: %(asctime)s MSG: %(filename)s:%(funcName)s:%(lineno)d %(message)s',
)

#ADMINS and MANAGERS
ADMINS = ()
MANAGERS = ADMINS

DEBUG = True
DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': True
}
TEMPLATE_DEBUG = DEBUG
INTERNAL_IPS = ('127.0.0.1',)

INSTALLED_APPS = [
  'django.contrib.staticfiles',
]

# HELLO
# For now we use the default, which is sqlite.

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': 'db.sqlite3',
  }
}

#DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.postgresql_psycopg2',
#        'NAME': 'bitnami_osqa',
#        'USER': 'bitnami',
#        'PASSWORD': '',
#        'HOST': '127.0.0.1',
#        'PORT': '5432',
#    }
#}

#CACHE_BACKEND = 'file://%s' % os.path.join(os.path.dirname(__file__),'cache').replace('\\','/')
CACHE_BACKEND = 'dummy://'
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# This should be equal to your domain name, plus the web application context.
# This shouldn't be followed by a trailing slash.
# I.e., http://www.yoursite.com or http://www.hostedsite.com/yourhostapp
APP_URL = 'http://localhost:8080/osqa'

#LOCALIZATIONS
TIME_ZONE = 'America/Los_Angeles'

#OTHER SETTINGS

USE_I18N = False
LANGUAGE_CODE = 'en'

DJANGO_VERSION = 1.1
OSQA_DEFAULT_SKIN = 'babysfirst'

DISABLED_MODULES = ['books', 'recaptcha', 'project_badges']
