# inventory/serializers.py

from rest_framework import serializers
from .models import InventoryItem, InventoryTransaction, ProductionRecord, ProductionTransaction

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'category', 'unit_price', 'reorder_level']

class InventoryTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTransaction
        fields = ['id', 'product', 'transaction_type', 'quantity', 'transaction_date', 'remarks']

# Production Management
class ProductionRecordSerializer(serializers.ModelSerializer):
    rawMaterials = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all(), many=True, required=False)  # Handle list of IDs
    quantityUsed = serializers.ListField(child=serializers.IntegerField(), required=False)  # Handle list of integers

    class Meta:
        model = ProductionRecord
        fields = ['id', 'productName', 'rawMaterials', 'quantityProduced', 'quantityUsed', 'productionDate']

class ProductionTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionTransaction
        fields = ['id', 'production_record', 'transaction_type', 'quantity', 'transaction_date', 'remarks']
