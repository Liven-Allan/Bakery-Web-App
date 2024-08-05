# inventory/urls.py

from django.urls import path
from .views import InventoryItemListCreate, InventoryTransactionListCreate,  InventoryItemDetailView, historical_data


urlpatterns = [
   path('inventory/', InventoryItemListCreate.as_view(), name='inventory-list-create'),
   path('inventory/<int:pk>/', InventoryItemDetailView.as_view(), name='inventory-detail'),  # Added URL pattern for delete view
   path('transactions/', InventoryTransactionListCreate.as_view(), name='transactions-list-create'),
   path('historical-data/', historical_data, name='historical-data'),
]
