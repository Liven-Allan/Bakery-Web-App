# inventory/views.py

from rest_framework import generics
from .models import InventoryItem, InventoryTransaction
from .serializers import InventoryItemSerializer, InventoryTransactionSerializer

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
