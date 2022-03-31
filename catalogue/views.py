from audioop import reverse
from cgitb import text
from math import fabs
from django.contrib import messages
from multiprocessing import context
from unittest import loader
from xml.etree.ElementTree import Comment
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required

from django.template import loader,RequestContext,Template

from catalogue.forms import CreateUserForm, RateForm


from .models import *

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
    
#Destination Page
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
        'reviews' :reviews
    }
    return HttpResponse(template.render(context,request))

      
