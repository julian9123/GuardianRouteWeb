@echo off
rem cmd /c
cls
rem cmd /c cordova platform rm android --force
rem timeout /t 3
rem cmd /c compilar.bat
rem timeout /t 3
rem cmd /c cordova prepare android
rem timeout /t 3
cmd /c cordova build
rem timeout /t 3
rem copy platforms\android\build\outputs\apk\* E:\ /y
@echo on