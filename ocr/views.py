from django.shortcuts import render

#OCR Page
def ocr_dashboard_view(request, *args, **kwargs):
    return render(request, "ocr/ocr-dashboard.html", {})
