@ECHO OFF
CLS

SET OUTPUT_DIR=%~dp0
SET "CSV_FILE=%OUTPUT_DIR%results.csv"
ECHO Test Number,Application,Result > "%CSV_FILE%"

:: Crear el archivo CSV con las cabeceras

SET "counter=1"

:Test1
ECHO Opening SAP
IF EXIST "C:\Program Files (x86)\SAP\FrontEnd\SapGui\saplogon.exe" (
    START "" "C:\Program Files (x86)\SAP\FrontEnd\SapGui\saplogon.exe"
    TIMEOUT /t 5
    ECHO %counter%,SAP,PASS >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,SAP,FAIL >> "%CSV_FILE%"
)
SET /A counter+=1

:Test2
ECHO Opening BASF Intranet Home Page
START "" "https://www.basf.net"
TIMEOUT /t 5
ECHO Opening BASF Global Printing Portal
START "" "https://service4you.intranet.basf.com/sp?id=basf_printing_portal&sysparm_language=en"
TIMEOUT /t 5
ECHO Opening BASF AccessIT Home Page
START "" "https://accessit.basf.net/irj/portal/accessit?guest_user=Guest_ACCESSIT"
TIMEOUT /t 5
ECHO Opening BASF MyHR Kiosk Home Page
START "" "https://kiosk.basf.net/"
TIMEOUT /t 5
ECHO Opening BASF Service 4 You Home Page
START "" "https://service4you.intranet.basf.com/sp?id=basf_index"
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,Intranet,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,Intranet,PASS >> "%CSV_FILE%"
)
SET /A counter+=1

:Test3
ECHO Opening Google Home Page
START "" "http://www.google.com"
TIMEOUT /t 5
ECHO Opening IBM Home Page
START "" "http://www.ibm.com"
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,Internet,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,Internet,PASS >> "%CSV_FILE%"
)
SET /A counter+=1

:Test4
ECHO Opening MS Teams
START "" "https://teams.microsoft.com"
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,MS Teams,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,MS Teams,PASS >> "%CSV_FILE%"
)
SET /A counter+=1

:Test5
ECHO Opening Microsoft Outlook
START /D "C:\Program Files\Microsoft Office\Office" OUTLOOK.EXE
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,Outlook Client,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,Outlook Client,PASS >> "%CSV_FILE%"
    
    :: Enviar el correo desde Outlook
    powershell -Command "try { $Outlook = New-Object -ComObject Outlook.Application; $Mail = $Outlook.CreateItem(0); $Mail.To = 'nicolas.a.silva@basf.com'; $Mail.Subject = 'test 5 UAT'; $Mail.Body = 'Este es un correo de prueba para el test 5.'; $Mail.Send(); Write-Host 'Email sent successfully.' } catch { Write-Host 'Failed to send email.' }"
    
    IF ERRORLEVEL 1 (
        ECHO %counter%,Email Send,FAIL >> "%CSV_FILE%"
    ) ELSE (
        ECHO %counter%,Email Send,PASS >> "%CSV_FILE%"
    )
)
SET /A counter+=1

:Test6
ECHO Launching OneDrive and Office Online
START "" "https://www.office.com"
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,OneDrive and Office Online,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,OneDrive and Office Online,PASS >> "%CSV_FILE%"
)
SET /A counter+=1

:Test7
ECHO Opening SharePoint
START "" "https://basf.sharepoint.com/SitePages/Home.aspx"
TIMEOUT /t 5
IF ERRORLEVEL 1 (
    ECHO %counter%,SharePoint,FAIL >> "%CSV_FILE%"
) ELSE (
    ECHO %counter%,SharePoint,PASS >> "%CSV_FILE%"
)
SET /A counter+=1


:: Envío de correo
ECHO Sending Email
ECHO #create COM object named Outlook > "C:\temp\sendmail.ps1"
ECHO $Outlook = New-Object -ComObject Outlook.Application >> "C:\temp\sendmail.ps1"
ECHO $Mail = $Outlook.CreateItem(0) >> "C:\temp\sendmail.ps1"
ECHO $Mail.To = "nicolas.a.silva@basf.com" >> "C:\temp\sendmail.ps1"
ECHO $Mail.Subject = "Pegasus WAN UAT Test Email" >> "C:\temp\sendmail.ps1"
ECHO $Mail.Body = "Attached is the UAT test log results." >> "C:\temp\sendmail.ps1"
ECHO $Mail.Attachments.Add("%CSV_FILE%") >> "C:\temp\sendmail.ps1"
ECHO $Mail.Send() >> "C:\temp\sendmail.ps1"
START /WAIT powershell.exe -ExecutionPolicy Bypass -File "C:\temp\sendmail.ps1"

ECHO Test Completed
TIMEOUT /t 10