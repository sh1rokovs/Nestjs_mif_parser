<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

##  Описание

Парсер mif файлов.

Требования: Node.js, Nest.js, RegExp

## Начальный запуск

```bash
install_and_start.sh
```

## Последующий запуск запуск

```bash
start.sh
```

## API path

```bash
localhost:5000/api/parse (POST-method)
```

Swagger

```bash
localhost:5000/api/swagger
```

POST запрос, в теле запроса подается ключ "file" со значением файла "test.mif; os.mif и др."<br>
Пример:
<div align="center">
  <img src="https://i.ibb.co/zRWhv7r/2023-04-24-004023890.png" alt="Nest Logo" />
</div>
На выходе объект типа JSON.
