from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5757")
        page.wait_for_timeout(5000) # wait for init
        page.screenshot(path="verification/screenshot.png")
        browser.close()

if __name__ == "__main__":
    verify()
