# Generated by Django 4.0.2 on 2022-03-24 23:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0006_delete_item_remove_review_review_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DestinationImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('images', models.FileField(upload_to='static/images/')),
                ('destination', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='catalogue.destination')),
            ],
        ),
    ]
