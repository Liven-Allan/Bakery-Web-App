# inventory/views.py

from rest_framework import generics
from .models import InventoryItem, InventoryTransaction, ProductionRecord, ProductionTransaction
from .serializers import InventoryItemSerializer, InventoryTransactionSerializer, ProductionRecordSerializer, ProductionTransactionSerializer

#chart
from django.http import JsonResponse
from rest_framework.decorators import api_view

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

# Production Management
# Add production record
class ProductionRecordListCreate(generics.ListCreateAPIView):
    queryset = ProductionRecord.objects.all()
    serializer_class = ProductionRecordSerializer

    def perform_create(self, serializer):
        production_record = serializer.save()
        ProductionTransaction.objects.create(
            production_record=production_record,
            transaction_type='Addition',
            quantity=production_record.quantityProduced,
            remarks='Initial production entry'
        )

# Retrieve, update, and delete production record
class ProductionRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductionRecord.objects.all()
    serializer_class = ProductionRecordSerializer

    def perform_update(self, serializer):
        production_record = serializer.save()
        ProductionTransaction.objects.create(
            production_record=production_record,
            transaction_type='Update',
            quantity=production_record.quantityProduced,
            remarks='Production record updated'
        )

# Add transaction record
class ProductionTransactionListCreate(generics.ListCreateAPIView):
    queryset = ProductionTransaction.objects.all()
    serializer_class = ProductionTransactionSerializer