import { beforeAppStartup, onAppStartup, onAppClose, onDayEnd, onDayStart, onHourly } from '../lifecycle/index';

export default defineNitroPlugin(async (nitroApp) => {
    // 1. Before App Startup
    if (beforeAppStartup) {
        try {
            await beforeAppStartup();
        } catch (error) {
            console.error('❌ [Lifecycle] Error in beforeAppStartup:', error);
        }
    }

    // 2. On App Startup
    if (onAppStartup) {
        try {
            await onAppStartup();
        } catch (error) {
            console.error('❌ [Lifecycle] Error in onAppStartup:', error);
        }
    }

    // 3. On App Close
    nitroApp.hooks.hook('close', async () => {
        if (onAppClose) {
            try {
                await onAppClose();
            } catch (error) {
                console.error('❌ [Lifecycle] Error in onAppClose:', error);
            }
        }
    });

    // --- Background Scheduler ---
    let lastDate = new Date().toDateString();
    let lastHour = new Date().getHours();

    setInterval(async () => {
        const now = new Date();
        const currentDate = now.toDateString();
        const currentHour = now.getHours();

        // Check for Hourly Trigger
        if (currentHour !== lastHour) {
            lastHour = currentHour;
            await (nitroApp.hooks as any).callHook('hourly');
        }

        // Check for Daily Trigger (Midnight)
        if (currentDate !== lastDate) {
            lastDate = currentDate;
            await (nitroApp.hooks as any).callHook('dayEnd');
            await (nitroApp.hooks as any).callHook('dayStart');
        }
    }, 60000); // Check every minute

    // --- Hook Registrations ---

    // 4. On Day Start
    (nitroApp.hooks as any).hook('dayStart', async () => {
        if (onDayStart) {
            try {
                await onDayStart();
            } catch (error) {
                console.error('❌ [Lifecycle] Error in onDayStart:', error);
            }
        }
    });

    // 5. On Day End
    (nitroApp.hooks as any).hook('dayEnd', async () => {
        if (onDayEnd) {
            try {
                await onDayEnd();
            } catch (error) {
                console.error('❌ [Lifecycle] Error in onDayEnd:', error);
            }
        }
    });

    // 6. On Hourly
    (nitroApp.hooks as any).hook('hourly', async () => {
        if (onHourly) {
            try {
                await onHourly();
            } catch (error) {
                console.error('❌ [Lifecycle] Error in onHourly:', error);
            }
        }
    });
});
