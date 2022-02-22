from django.shortcuts import render

#Catalogue Page
def catalogue_view(request, *args, **kwargs):
    return render(request, "catalogue.html", {})

#Index Page
def index_view(request, *args, **kwargs):
    return render(request, "index.html", {}) 

#Base Page
def base_view(request, *args, **kwargs):
    return render(request, "base.html", {}) 

#Home Page
def home_view(request, *args, **kwargs):
    return render(request, "home.html", {})   

#Login Page
def login_view(request, *args, **kwargs):
    return render(request, "login.html", {})     

#Destination Page
def destination_view(request, *args, **kwargs):
    return render(request, "destination.html", {})   