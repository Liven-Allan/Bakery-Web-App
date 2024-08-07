# inventory/urls.py

from django.urls import path
from .views import InventoryItemListCreate, InventoryTransactionListCreate,  InventoryItemDetailView, ProductionRecordListCreate, ProductionRecordDetailView, ProductionTransactionListCreate, historical_data


urlpatterns = [
   path('inventory/', InventoryItemListCreate.as_view(), name='inventory-list-create'),
   path('inventory/<int:pk>/', InventoryItemDetailView.as_view(), name='inventory-detail'),  # Added URL pattern for delete view
   path('transactions/', InventoryTransactionListCreate.as_view(), name='transactions-list-create'),
   path('historical-data/', historical_data, name='historical-data'),
   path('productions/', ProductionRecordListCreate.as_view(), name='productions-list-create'),
   path('productions/<int:pk>/', ProductionRecordDetailView.as_view(), name='productions-detail'),
   path('production-transactions/', ProductionTransactionListCreate.as_view(), name='production-transactions-list-create'),  # Added URL for production transactions
]
