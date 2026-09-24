@echo off
title UPSC CSE Master Hub - Auto Push
color 0A

echo =======================================================
echo     UPSC CSE Master Hub - Auto GitHub Push Script
echo =======================================================
echo.
echo [1/4] Generating App Data from Excel...
cd ..
node scripts/parseExcel.js

echo.
echo [2/4] Adding new updates...
git add "Update_App_Data/Toppers Strategy & Interviews.xlsx"
git add "Update_App_Data/upsc_toppers_data.xlsx"
git add "src/data/generatedToppersData.json"
git add .

echo.
echo [3/4] Saving changes...
git commit -m "Update App Content via Excel"

echo.
echo [4/4] Pushing to GitHub (Please wait)...
git push origin main

echo.
echo =======================================================
echo  SUCCESS! Your app will be updated live in a few mins.
echo =======================================================
echo.
pause
