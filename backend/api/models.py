from django.db import models

class EquipmentDataset(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    filename = models.CharField(max_length=255)
    data = models.JSONField()  # Stores the list of equipment data
    stats = models.JSONField(default=dict) # Stores the summary stats

    class Meta:
        ordering = ['-uploaded_at']

    def save(self, *args, **kwargs):
        # Keep only the last 5 datasets
        # This is a simple implementation; in high concurrency might be race-condition prone but fine for this task
        super().save(*args, **kwargs)
        objects = EquipmentDataset.objects.all()
        if objects.count() > 5:
            # Delete oldest
            objects[5:].delete()
