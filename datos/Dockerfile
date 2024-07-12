FROM php:apache

WORKDIR /var/www/html

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"  && \
    php composer-setup.php  && \
    php -r "unlink('composer-setup.php');"  && \
    mv composer.phar /usr/local/bin/composer

COPY ./datos/composer.json .
COPY ./datos/.htaccess .
COPY ./datos/.env .

RUN apt update && apt install -y zip && apt install -y git

RUN composer install

RUN composer dump-autoload

RUN sed -i 's/DocumentRoot.*$/DocumentRoot \/var\/www\/html\/public/' /etc/apache2/sites-enabled/000-default.conf

COPY ./datos . 
 # ¿Hay errores aquí?
