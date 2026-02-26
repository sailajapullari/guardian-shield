from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    user_email = models.EmailField(blank=True, null=True)
    order_id = models.CharField(max_length=255, unique=True)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    signature = models.CharField(max_length=512, blank=True, null=True)
    amount = models.FloatField()
    spending_range = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    device_used = models.CharField(max_length=512, blank=True, null=True)
    time_spent = models.FloatField(blank=True, null=True, help_text="Time spent on checkout in seconds")
    transaction_frequency = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.order_id} - {self.status}"

