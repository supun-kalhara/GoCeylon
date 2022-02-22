from django.db import models

class Item(models.Model):
     title = models.CharField(max_length=254)
     description = models.TextField(max_length=1000)
     mainimage = models.ImageField(null=True, blank=True)
     images = models.ImageField(null=True, blank=True)
