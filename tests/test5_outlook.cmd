@echo off
SETLOCAL

START /D "C:\Program Files\Microsoft Office\Office" OUTLOOK.EXE

timeout /t 5 /nobreak >nul

:: Intentar enviar correo usando PowerShell (opcional)
powershell -Command "try { $Outlook = New-Object -ComObject Outlook.Application; $Mail = $Outlook.CreateItem(0); $Mail.To = 'nicolas.a.silva@basf.com'; $Mail.Subject = 'test 5 UAT'; $Mail.Body = 'Este es un correo de prueba para el test 5.'; $Mail.Send(); exit 0 } catch { exit 1 }"

if %errorlevel% equ 0 (
    echo Outlook,PASS
) else (
    echo Outlook,FAIL
)

ENDLOCAL
