CREATE DATABASE mHealthRecords;

use mHealthRecords;

Select * From mHealthRecords.owners;
Select * From mHealthRecords.patients;
Select * From mHealthRecords.vital_parameters;
Select * From mHealthRecords.diseases;
Select * From mHealthRecords.physicians;

create table owners (
ID int auto_increment primary key,
Name varchar (255),
Email varchar (255),
Password varchar(255)
);

create table patients (
ID int auto_increment primary key,
First_Name varchar (255),
Last_Name varchar (255),
Age int,
Address varchar (255),
Email varchar (255),
ParametersID int,
Diseases varchar (255)
);

create table vital_parameters (
ID int primary key,
ECG int,
Oxigen_Saturation int,
Tension int,
Glucose int,
Temperature int,
Weight int,
Spirometry int,
Blood_Pressure int,
Sleep_Duration int,
Steeps int
);

create table diseases (
ID int auto_increment primary key,
Disease varchar (255)
);

create table physicians (
ID int auto_increment primary key,
First_Name varchar (255),
Last_Name varchar (255),
Age int,
Address varchar (255),
Email varchar (255),
Hospital varchar (255)
);



