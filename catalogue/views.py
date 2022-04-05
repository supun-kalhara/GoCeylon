from audioop import reverse
from cgitb import text
from math import fabs
from django.contrib import messages
from multiprocessing import context
from unittest import loader
from xml.etree.ElementTree import Comment
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from django.contrib.auth.decorators import login_required
from django.template import loader,RequestContext,Template
from catalogue.forms import CreateUserForm, RateForm, UserImage
from .models import *
from django.conf import settings

import requests
import time

#Catalogue Page
def catalogue_view(request, *args, **kwargs):
    destinations = Destination.objects.all()
    
    context = {'destinations': destinations}
    return render(request, "catalogue.html",context)

#Index Page
def index_view(request, *args, **kwargs):
    return render(request, "index.html", {}) 

#Base Page
def base_view(request, *args, **kwargs):
    return render(request, "base.html", {}) 

#Home Page
def home_view(request, *args, **kwargs):
    return render(request, "home.html", {})   

#Logout Funtion
def logout_user(request):
    logout(request)
    return redirect('login-view')   

#Rate Page
@login_required(login_url='login-view')
def Rate(request, d_id):
    destinations = Destination.objects.get(id=d_id)
    user = request.user

    if request.method =='POST':
        form = RateForm(request.POST)
        if form.is_valid():
            rate = form.save(commit=False)
            rate.user = user
            rate.destination = destinations
            rate.save()       
            return redirect('destination-view', d_id=d_id)
    else:
        form = RateForm()

    template = loader.get_template('rate.html') 
    context = {
        'form':form,
        'destination':destinations,
    }
    return HttpResponse(template.render(context,request)) 

 
#sign-in view
def register_view(request):
    if request.user.is_authenticated:
        return redirect('home-view')
    else:
        form=CreateUserForm()

        if request.method =='POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('login-view')
        else:
            form=CreateUserForm()
            
        context = {'form':form}
        return render(request,'login.html',context)

#login view
def login_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect('home-view')
    else:
        context = {}
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home-view')
            else:
                messages.info(request, 'Username or Password is incorrect ' + username + ' ' + password)
                #render error messages using syntax in html file
                #here
                return render(request, "login.html", context)
        return render(request, "login.html", {})   

#dashboard Page
def dashboard_view(request, *args, **kwargs):
    if request.method == 'POST':
        form = UserImage(request.POST, request.FILES)  
        if form.is_valid():  
            form.save()  

            img_object = form.instance  
            #get file name, path and extension
            file_path = img_object.user_img.path
            file_name = img_object.get_filename()
            file_extension = img_object.get_extension()
            #write http request to upload to s3 bucket
            url = (settings.AWS_S3 + file_name)
            payload=open(file_path, 'rb')
            content_type = 'image/' + file_extension
            headers = {
            'Content-Type': content_type
            }
            response = requests.request("PUT", url, headers=headers, data=payload)
            return render(request, "dashboard.html", {'form': form, 'img_obj': img_object})  
    else:  
        form = UserImage()  
    return render(request, "dashboard.html", {'form': form})

def destination_view(request,d_id):
    #destinations = Destination.objects.get(id=d_id)
    destination = get_object_or_404(Destination, id=d_id)
    dImages= DestinationImage.objects.filter(destination=destination)
    review_count=len(Review.objects.filter(destination=destination))
    reviews=Review.objects.filter(destination=destination)
    template = loader.get_template('destination.html') 
    context = {
        'destination':destination,
        'dImages' :dImages,
        'review_count': review_count,
        'reviews' :reviews,
        'maps_url' : destination.get_maps_url(),
    }
    return HttpResponse(template.render(context,request))

def destination_view2(request,d_id):
    #destinations = Destination.objects.get(id=d_id)
    destination = get_object_or_404(Destination, id=d_id)
    dImages= DestinationImage.objects.filter(destination=destination)
    review_count=len(Review.objects.filter(destination=destination))
    reviews=Review.objects.filter(destination=destination)
    template = loader.get_template('destination2.html') 
    context = {
        'destination':destination,
        'dImages' :dImages,
        'review_count': review_count,
        'reviews' :reviews,
        'maps_url' : destination.get_maps_url(),
    }
    return HttpResponse(template.render(context,request))

def test_view(request, *args, **kwargs):
    url = "https://o890xnpzu0.execute-api.ap-southeast-1.amazonaws.com/testing/ec2"
    response = requests.get(url, params=request.GET)
    print(response.json()["body"])
    return HttpResponse("complete" + response.json()["body"])

      
