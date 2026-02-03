from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import EquipmentDataset
from .serializers import EquipmentDatasetSerializer
import pandas as pd
import json

class EquipmentDatasetViewSet(viewsets.ModelViewSet):
    queryset = EquipmentDataset.objects.all()
    serializer_class = EquipmentDatasetSerializer

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Parse CSV
            df = pd.read_csv(file_obj)
            
            # Normalize column names (handle potential variations)
            df.columns = df.columns.str.strip().str.lower()
            column_map = {
                'equipment name': 'equipmentName',
                'equipmentname': 'equipmentName',
                'type': 'type',
                'flowrate': 'flowrate',
                'pressure': 'pressure',
                'temperature': 'temperature'
            }
            df = df.rename(columns=column_map)
            
            # Ensure required columns exist
            required_cols = ['equipmentName', 'type', 'flowrate', 'pressure', 'temperature']
            missing = [col for col in required_cols if col not in df.columns]
            if missing:
                return Response({"error": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            # Convert to list of dicts
            data_records = df.to_dict(orient='records')
            
            # Create dataset
            dataset = EquipmentDataset(
                filename=file_obj.name,
                data=data_records
            )
            
            # Generate stats
            stats = self._calculate_stats(df)
            dataset.stats = stats
            dataset.save()
            
            return Response({
                "id": dataset.id,
                "uploaded_at": dataset.uploaded_at,
                "filename": dataset.filename,
                "stats": stats,
                "data": data_records
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest_dataset = EquipmentDataset.objects.first() # Meta ordering is -uploaded_at
        if not latest_dataset:
            return Response({"message": "No data available"}, status=status.HTTP_200_OK)
        
        df = pd.DataFrame(latest_dataset.data)
        stats = self._calculate_stats(df)
        
        return Response({
            "id": latest_dataset.id,
            "uploaded_at": latest_dataset.uploaded_at,
            "filename": latest_dataset.filename,
            "stats": stats,
            "data": latest_dataset.data
        })

    def _calculate_stats(self, df):
        return {
            "totalEquipment": len(df),
            "avgFlowrate": df['flowrate'].mean() if not df.empty else 0,
            "avgPressure": df['pressure'].mean() if not df.empty else 0,
            "avgTemperature": df['temperature'].mean() if not df.empty else 0,
            "typeDistribution": df['type'].value_counts().to_dict()
        }
