# inventory/views.py

from rest_framework import generics
from .models import InventoryItem, InventoryTransaction
from .serializers import InventoryItemSerializer, InventoryTransactionSerializer

#chart
from django.db.models import Sum, F
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_datetime
import datetime

# add item to inventory
class InventoryItemListCreate(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

# add transaction record
class InventoryTransactionListCreate(generics.ListCreateAPIView):
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer

# Handle item retrieval, update, and deletion
class InventoryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

#chart
@api_view(['GET'])
def historical_data(request):
    # Get all transactions with related inventory items
    transactions = InventoryTransaction.objects.select_related('product').all()

    # Format data for each transaction
    result = []
    for transaction in transactions:
        date = transaction.transaction_date.date()
        quantity = transaction.quantity
        unit_price = transaction.product.unit_price
        
        # Add data to the result list
        result.append({
            'date': date.strftime('%Y-%m-%d'),
            'product': transaction.product.name,
            'quantity': quantity,
            'unit_price': str(unit_price)  # Ensure unit_price is a string
        })

    return JsonResponse(result, safe=False)