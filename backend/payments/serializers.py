from rest_framework import serializers

from .models import Payment


class CreateOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1)


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_payment_id = serializers.CharField()
    razorpay_order_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    amount = serializers.FloatField()
    user_email = serializers.EmailField()
    location = serializers.CharField()
    device_used = serializers.CharField()
    time_spent = serializers.FloatField()


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "user_email",
            "order_id",
            "payment_id",
            "signature",
            "amount",
            "spending_range",
            "location",
            "device_used",
            "time_spent",
            "transaction_frequency",
            "status",
            "created_at",
        ]

