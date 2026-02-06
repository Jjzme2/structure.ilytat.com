/**
 * Lifecycle Hooks Configuration
 * Define your application lifecycle logic here.
 */

import { getFirestore } from 'firebase-admin/firestore'

const lifeCycleLogger = (message: string) => {
    const timestamp = new Date().toISOString();
    const messagePrefix = `[Lifecycle] ${timestamp}`;
    console.log(`${messagePrefix} ${message}`);
}

export const beforeAppStartup = async () => {
    lifeCycleLogger('🔄 Before App Startup');
};

export const onAppStartup = async () => {
    lifeCycleLogger('🚀 App Startup Complete');
};

export const onAppClose = async () => {
    lifeCycleLogger('🛑 App Closing');
};

export const onDayEnd = async () => {
    lifeCycleLogger('🌙 Day End');
};

export const onDayStart = async () => {
    lifeCycleLogger('🌞 Day Start');

    // Auto-focus tasks with due date matching today
    await autoFocusDueDateTasks();
};

export const onHourly = async () => {
    lifeCycleLogger('⏰ Hourly Maintenance');
};

/**
 * Moves tasks with dueDate matching today from backlog to focus
 */
async function autoFocusDueDateTasks() {
    try {
        const db = getFirestore();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        lifeCycleLogger(`📅 Checking for tasks due today (${today})...`);

        // Query all backlog tasks with dueDate = today
        const snapshot = await db.collection('tasks')
            .where('status', '==', 'backlog')
            .where('dueDate', '==', today)
            .get();

        if (snapshot.empty) {
            lifeCycleLogger('📅 No tasks due today found in backlog');
            return;
        }

        lifeCycleLogger(`📅 Found ${snapshot.size} tasks due today, moving to focus...`);

        // Group by userId to respect per-user focus limits
        const tasksByUser: Record<string, FirebaseFirestore.QueryDocumentSnapshot[]> = {};
        snapshot.forEach(doc => {
            const userId = doc.data().userId;
            if (!tasksByUser[userId]) tasksByUser[userId] = [];
            tasksByUser[userId].push(doc);
        });

        // Process each user's tasks
        for (const userId in tasksByUser) {
            const userTasks = tasksByUser[userId];
            if (!userTasks) continue;

            // Get current focus count for this user
            const focusSnapshot = await db.collection('tasks')
                .where('userId', '==', userId)
                .where('status', '==', 'focus')
                .where('focusDate', '==', today)
                .get();

            let currentFocusCount = focusSnapshot.size;

            // Move tasks to focus (respecting 6 limit)
            for (const taskDoc of userTasks) {
                if (currentFocusCount >= 6) {
                    lifeCycleLogger(`📅 User ${userId} has reached focus limit, skipping remaining due tasks`);
                    break;
                }

                currentFocusCount++;
                await taskDoc.ref.update({
                    status: 'focus',
                    focusDate: today,
                    focusOrder: currentFocusCount,
                    updatedAt: new Date()
                });

                lifeCycleLogger(`📅 Moved task "${taskDoc.data().title}" to focus (#${currentFocusCount})`);
            }
        }

        lifeCycleLogger('📅 Auto-focus complete');
    } catch (error) {
        lifeCycleLogger(`📅 Error in autoFocusDueDateTasks: ${error}`);
    }
}
