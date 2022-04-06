from cgitb import text
from msilib.schema import SelfReg
from random import choices
from unicodedata import name

from django.db import models
from django.contrib.auth.models import User


class Destination(models.Model):
     name = models.CharField(max_length=100, null=True)
     location= models.CharField(max_length=1000, null=True)
     image=models.ImageField(null=True,blank=False)
     description = models.TextField(max_length=3500, null=True)
     average_rate =models.DecimalField(null=True, max_digits=20, decimal_places=2)

     def __str__(self):
          return self.name

class DestinationImage(models.Model):
     destination=models.ForeignKey(Destination, default=None, on_delete=models.CASCADE)
     images=models.FileField(upload_to='static/images/')

     def __str__(self):
          return self.destination.name


RATE_CHOICES = [
     (1, 'Terrible'),
     (2, 'Bad'),
     (3, 'Neutral'),
     (4, 'Good'),
     (5, 'Amazing'),
]
      

class Review(models.Model):
     
     text = models.CharField(max_length=3000, blank=True)
     user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
     destination = models.ForeignKey(Destination,null=True,on_delete=models.SET_NULL)
     rate = models.PositiveSmallIntegerField(choices=RATE_CHOICES,null=True)
     created_at= models.DateTimeField(auto_now_add=True, blank=True, null=True)
          
class Admin(models.Model):
     firstName = models.CharField(max_length=254, null=True)
     lastName = models.CharField(max_length=1000, null=True)
     emailAddress = models.CharField(max_length=254, null=True)
     age =models.IntegerField(null=True)
     gender = models.CharField(max_length=254, null=True)

     def __str__(self):
          return self.firstName
     
     



     
