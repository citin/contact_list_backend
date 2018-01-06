Simple Email Based Marketing System
===================================

Instrucciones:

1. editar `/etc/hosts` con lo siguiente:
```
127.0.0.1 lascampanias.com
```

2. levantar la applicacion con docker-compose:
```bash
docker-compose up
```

3. acceder a la applicacion en `http://lascampanias.com:8080/`

4. Luego de crear y enviar la campania, corroborar el envio en la consola y
   clickear el link que se agrega al final de cada mail para tener datos de
   estadisticas.


api endpoints:

- token auth:

        POST: /api-token-auth/
        Body: username=username&password=password

- Campaign Stats:

        GET: /api/campaigns/:id/stats/
        Response:
            {
                "datetime_sent": null,
                "times_opened": 12,
                "successful_email_count": 2,
                "unsuccessful_email_count": 0,
                "emails": [
                    {
                        "contact": "asdfd@Noid.com",
                        "sent": true,
                        "seen": true,
                        "seen_times": 2
                    },
                    {
                        "contact": "asdd@asssdddfasd.com",
                        "sent": true,
                        "seen": true,
                        "seen_times": 10
                    }
                ]
            }
