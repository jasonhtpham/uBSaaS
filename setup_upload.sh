#!/bin/bash
# script to setup folder structure for uploading
echo $(pwd)
cwd=$(pwd)
cd ..
mkdir uploads
cd uploads
mkdir $PROJECT_FOLDER
cd $PROJECT_FOLDER
mkdir profilePicture
mkdir docs
mkdir video
mkdir audio
cd profilePicture
mkdir thumb
cd ..
cd video
mkdir thumb
cd $cwd
echo "Your setup was succesfully completed"