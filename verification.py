from playwright.sync_api import sync_playwright
import time

def run_verification(page):
    # Instead of running the full Nuxt app, we will use the UI Verification Fallback
    # to render the component as pure HTML/CSS/Tailwind since Nuxt API credentials
    # might be missing locally and block isolated component rendering.

    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background-color: #0f172a; min-height: 100vh; margin: 0; }
        </style>
    </head>
    <body>
        <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">

            <!-- Error Toast -->
            <div role="alert" aria-live="assertive" class="pointer-events-auto min-w-[300px] max-w-sm w-full bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 flex items-start gap-4 transform transition-all duration-300">
                <span aria-hidden="true" class="text-rose-400 text-xl">✕</span>
                <div class="flex-1">
                    <p class="text-sm font-medium text-white">Critical error occurred!</p>
                </div>
                <button aria-label="Close notification" class="text-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">✕</button>
            </div>

            <!-- Success Toast -->
            <div role="status" aria-live="polite" class="pointer-events-auto min-w-[300px] max-w-sm w-full bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 flex items-start gap-4 transform transition-all duration-300">
                <span aria-hidden="true" class="text-emerald-400 text-xl">✓</span>
                <div class="flex-1">
                    <p class="text-sm font-medium text-white">Action successful!</p>
                </div>
                <button aria-label="Close notification" class="text-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">✕</button>
            </div>

            <!-- Warning Toast -->
            <div role="alert" aria-live="assertive" class="pointer-events-auto min-w-[300px] max-w-sm w-full bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 flex items-start gap-4 transform transition-all duration-300">
                <span aria-hidden="true" class="text-amber-400 text-xl">⚠</span>
                <div class="flex-1">
                    <p class="text-sm font-medium text-white">Warning: Low disk space.</p>
                </div>
                <button aria-label="Close notification" class="text-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">✕</button>
            </div>

        </div>
    </body>
    </html>
    """

    page.set_content(html_content)
    page.wait_for_timeout(2000) # wait for tailwind CDN to load and apply

    # Take screenshot
    page.screenshot(path="verification_screenshot.png")
    page.wait_for_timeout(1000)

    # Focus the first close button to show the focus ring
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)
    page.screenshot(path="verification_screenshot_focus.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification_videos")
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
