from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Browser error: {err}"))

    try:
        page.goto("http://localhost:5757/login")

        # Take a screenshot to see what's rendered
        page.screenshot(path="verification/debug_login.png")

        # Wait for the password input to be visible
        page.wait_for_selector("input#password", timeout=5000)

        # Check initial state
        password_input = page.locator("input#password")
        input_type = password_input.get_attribute("type")
        print(f"Initial input type: {input_type}")
        assert input_type == "password"

        # Type something
        password_input.fill("secret123")

        # Find the show password button
        toggle_button = page.locator("button[aria-label='Show password']")

        # Click it
        toggle_button.click()

        # Check updated state
        input_type = password_input.get_attribute("type")
        print(f"Toggled input type: {input_type}")
        assert input_type == "text"

        # Take screenshot showing text visible
        page.screenshot(path="verification/verification_login.png")

        # Toggle back
        toggle_button = page.locator("button[aria-label='Hide password']")
        toggle_button.click()

        input_type = password_input.get_attribute("type")
        print(f"Final input type: {input_type}")
        assert input_type == "password"

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error_login.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
