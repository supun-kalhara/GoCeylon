from django.shortcuts import render

#Catalogue Page
def catalogue_view(request, *args, **kwargs):
    return render(request, "catalogue.html", {})

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