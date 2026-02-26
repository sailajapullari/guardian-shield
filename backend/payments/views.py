from datetime import timedelta

import razorpay
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import CreateOrderSerializer, PaymentSerializer, VerifyPaymentSerializer


class CreateOrderView(APIView):
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data["amount"]

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        razorpay_order = client.order.create(
            {
                "amount": amount * 100,
                "currency": "INR",
                "payment_capture": 1,
            }
        )

        Payment.objects.create(
            order_id=razorpay_order["id"],
            amount=float(amount),
            status="created",
        )

        return Response(
            {
                "order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            },
            status=status.HTTP_201_CREATED,
        )


def _calculate_spending_range(amount: float) -> str:
    if amount < 500:
        return "Low"
    if amount < 2000:
        return "Medium"
    return "High"


def _calculate_transaction_frequency(user_email: str) -> int:
    if not user_email:
        return 0
    now = timezone.now()
    since = now - timedelta(hours=24)
    return Payment.objects.filter(user_email=user_email, created_at__gte=since).count()


class VerifyPaymentView(APIView):
    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment_id = serializer.validated_data["razorpay_payment_id"]
        order_id = serializer.validated_data["razorpay_order_id"]
        signature = serializer.validated_data["razorpay_signature"]
        amount = serializer.validated_data["amount"]
        user_email = serializer.validated_data["user_email"]
        location = serializer.validated_data["location"]
        device_used = serializer.validated_data["device_used"]
        time_spent = serializer.validated_data["time_spent"]

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": order_id,
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature,
                }
            )
        except razorpay.errors.SignatureVerificationError:
            Payment.objects.filter(order_id=order_id).update(status="failed")
            return Response({"detail": "Invalid payment signature."}, status=status.HTTP_400_BAD_REQUEST)

        spending_range = _calculate_spending_range(amount)
        transaction_frequency = _calculate_transaction_frequency(user_email)

        payment_obj, _ = Payment.objects.get_or_create(order_id=order_id)
        payment_obj.user_email = user_email
        payment_obj.payment_id = payment_id
        payment_obj.signature = signature
        payment_obj.amount = float(amount)
        payment_obj.spending_range = spending_range
        payment_obj.location = location
        payment_obj.device_used = device_used
        payment_obj.time_spent = float(time_spent)
        payment_obj.transaction_frequency = transaction_frequency
        payment_obj.status = "paid"
        payment_obj.save()

        return Response(PaymentSerializer(payment_obj).data, status=status.HTTP_200_OK)


class PaymentHistoryView(APIView):
    def get(self, request):
        user_email = request.query_params.get("user_email")
        if not user_email:
            return Response({"detail": "user_email query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        payments = Payment.objects.filter(user_email=user_email).order_by("-created_at")
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

