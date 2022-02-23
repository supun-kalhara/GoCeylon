from cgitb import text
from msilib.schema import SelfReg
from random import choices

from django.db import models
from django.contrib.auth.models import User


class Destination(models.Model):
     name = models.CharField(max_length=100, null=True)
     location= models.CharField(max_length=100, null=True)
     image=models.ImageField(null=True,blank=False)
     description = models.TextField(max_length=3500, null=True)

     def __str__(self):
          return self.name

RATE_CHOICES = [
     (1, 'Best'),
     (2, 'good'),
     (3, 'okay'),
     (4, 'bad'),
     (5, 'worse'),
]
      

class Review(models.Model):
     
     text = models.CharField(max_length=3000, blank=True)
     user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
     destination = models.ForeignKey(Destination,null=True,on_delete=models.SET_NULL)
     rate = models.PositiveSmallIntegerField(choices=RATE_CHOICES,null=True)
     #created_at= models.DateTimeField(auto_now_add=True)
     
     
     




      
class Admin(models.Model):
     firstName = models.CharField(max_length=254, null=True)
     lastName = models.CharField(max_length=1000, null=True)
     emailAddress = models.CharField(max_length=254, null=True)
     age =models.IntegerField(null=True)
     gender = models.CharField(max_length=254, null=True)

     def __str__(self):
          return self.firstName
     
     



     
