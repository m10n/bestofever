
mkdir -p ./tmp
cd ./tmp

echo 'Downloading get-pip.py'
curl -O https://raw.github.com/pypa/pip/master/contrib/get-pip.py

echo 'Running get-pip.py'
sudo python ./get-pip.py

echo 'Installing Django'
sudo pip install Django==1.3.3

echo 'Installing python mysql library'
sudo pip install mysql_python

echo 'Installing markdown'
sudo pip install markdown

echo 'Installing html5lib'
sudo pip install html5lib

echo 'Syncing DB'
python manage.py syncdb

