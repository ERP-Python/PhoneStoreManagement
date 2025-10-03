from django.db import models


class SystemConfig(models.Model):
    """System Configuration model"""
    key = models.CharField(max_length=100, unique=True, db_index=True)
    value = models.TextField()
    description = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_config'
        verbose_name = 'System Configuration'
        verbose_name_plural = 'System Configurations'

    def __str__(self):
        return f"{self.key}: {self.value[:50]}" 