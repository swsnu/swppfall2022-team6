# Generated by Django 4.1.2 on 2022-10-30 09:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='report',
            old_name='longitutde',
            new_name='longitude',
        ),
    ]