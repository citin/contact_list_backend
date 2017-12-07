Simple Email Based Marketing System
===================================

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
