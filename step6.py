from selenium import webdriver
from selenium.webdriver.edge.service import Service
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.common.exceptions import WebDriverException, TimeoutException
import time

# Inicializar el navegador Edge
service = Service(EdgeChromiumDriverManager().install())
driver = webdriver.Edge(service=service)

# URLs de las aplicaciones Office 365 que se deben abrir
office_apps = {
    "Word Online": "https://www.office.com/launch/word",
    "Excel Online": "https://www.office.com/launch/excel",
    "PowerPoint Online": "https://www.office.com/launch/powerpoint",
    "OneDrive": "https://www.office.com/launch/onedrive",
    "Outlook (Mail)": "https://outlook.office.com/mail"
}

# Función general para abrir una app
def open_office_app(name, url):
    try:
        print(f"Abrir {name}...")
        driver.get(url)
        time.sleep(5)  # Espera a que la app cargue
        return driver.title
    except (WebDriverException, TimeoutException) as e:
        print(f"Error al abrir {name}: {e}")
        return None

# Ejecutar las pruebas
if __name__ == "__main__":
    results = {}

    for name, url in office_apps.items():
        results[name] = open_office_app(name, url)

    print("\n--- RESULTADOS DEL PASO 6 ---")
    for name, title in results.items():
        if title:
            print(f"{name} abierto correctamente - Título: {title}")
        else:
            print(f"{name} no pudo abrirse.")

    driver.quit()

