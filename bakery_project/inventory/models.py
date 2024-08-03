# inventory/models.py

from django.db import models

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default='rawmaterial')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField()

    def __str__(self):
        return self.name

class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('Addition', 'Addition'),
        ('Removal', 'Removal'),
        ('Update', 'Update'),
    ]

    product = models.ForeignKey('InventoryItem', on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f'{self.transaction_type} - {self.product.name}'
