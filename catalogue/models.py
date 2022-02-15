from django.db import models
from django.contrib.auth.models import User


class Destination(models.Model):
     name = models.CharField(max_length=100, null=True)
     description = models.TextField(max_length=3000, null=True)

     def __str__(self):
          return self.name


class Review(models.Model):
     
     review = models.TextField(max_length=3000, null=True)
     user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
     destination = models.ForeignKey(Destination,null=True,on_delete=models.SET_NULL)

     



class Admin(models.Model):
     firstName = models.CharField(max_length=254, null=True)
     lastName = models.CharField(max_length=1000, null=True)
     emailAddress = models.CharField(max_length=254, null=True)
     age =models.IntegerField(null=True)
     gender = models.CharField(max_length=254, null=True)

     def __str__(self):
          return self.firstName
