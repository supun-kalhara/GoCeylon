from audioop import reverse
from cgitb import text
from unittest import loader
from xml.etree.ElementTree import Comment
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect

from django.template import loader,RequestContext,Template

from catalogue.forms import RateForm


from .models import *

#Catalogue Page
def catalogue_view(request, *args, **kwargs):
    destinations = Destination.objects.all()
    
    context = {'destinations': destinations}
    return render(request, "catalogue.html",context)

#Index Page
def index_view(request, *args, **kwargs):
    return render(request, "index.html", {}) 

#Navigation Bar
def navigation_view(request, *args, **kwargs):
    return render(request, "navigation-bar.html", {}) 

#Home Page
def home_view(request, *args, **kwargs):
    return render(request, "home.html", {})   

#Login Page
def login_signup_view(request, *args, **kwargs):
    return render(request, "login_signup.html", {})      


#Rate Page
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
    else:
        form = RateForm()

    template = loader.get_template('rate.html') 
    context = {
        'form':form,
        'destination':destinations,
    }
    return HttpResponse(template.render(context,request)) 