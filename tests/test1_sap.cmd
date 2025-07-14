@echo off
SETLOCAL

set "SAP_PATH=C:\Program Files (x86)\SAP\FrontEnd\SapGui\saplogon.exe"

if exist "%SAP_PATH%" (
    START "" "%SAP_PATH%"
    TIMEOUT /t 30 /nobreak >nul

    :: Cierra el proceso saplogon.exe
    taskkill /IM saplogon.exe /F >nul 2>&1

    echo SAP,PASS
) else (
    echo SAP,FAIL
)

ENDLOCAL

