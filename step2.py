from selenium import webdriver
from selenium.common.exceptions import WebDriverException, TimeoutException
import time

# Configura el controlador del navegador (en este caso, Chrome)
#driver_path = r'C:\ProgramData\Microsoft\Windows\Start Menu\Programs' # Reemplaza con la ruta a tu ChromeDriver
driver = webdriver.Edge()

# Funciones para acceder a cada URL
def access_bASF_intranet():
    try:
        driver.get("https://intranet.bASF.com")  # Reemplaza con la URL correcta
        time.sleep(2)  # Espera a que la página cargue
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error accediendo a BASF Intranet: {e}")
        return None

def access_gpp():
    try:
        driver.get("https://gpp.bASF.com")  # Reemplaza con la URL correcta
        time.sleep(2)
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error accediendo a GPP: {e}")
        return None

def access_accessIT():
    try:
        driver.get("https://accessit.basf.net/irj/portal/accessit")  # Reemplaza con la URL correcta
        time.sleep(2)
        # Encuentra el botón "Log In" y haz clic en él
        login_button = driver.find_element("xpath", '//*[@id="certButtonMain"]')  # Ajusta el XPath según sea necesario
        login_button.click()
        time.sleep(2)
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error accediendo a AccessIT: {e}")
        return None

def access_hr_kiosk():
    try:
        driver.get("https://hp1r3.bcs.de/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fcom.basfits.hr!2fgl!2flogon_page!2fcom.basfits.hr.global.iv.ep.java.login?ume.logon.locale=es_ES&region=lu&bandwith=medium&ip=10.12.20.4&letitsnow=false")  # Reemplaza con la URL correcta
        time.sleep(2)
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error accediendo a HR Kiosk: {e}")
        return None

def access_service4you():
    try:
        driver.get("https://service4you.intranet.basf.com/esc")  # Reemplaza con la URL correcta
        time.sleep(2)
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error accediendo a Service4You: {e}")
        return None

# Ejecutar las pruebas
if __name__ == "__main__":
    urls = {
        "BASF Intranet Home": access_bASF_intranet(),
        #"GPP": access_gpp(),
        "AccessIT": access_accessIT(),
        "HR Kiosk": access_hr_kiosk(),
        "Service4You": access_service4you(),
    }

    # Imprimir los resultados
    for name, title in urls.items():
        if title:
            print(f"Accedido a: {name} - Título: {title}")
        else:
            print(f"Acceso a {name} fallido.")

    # Cerrar el navegador
    driver.quit()