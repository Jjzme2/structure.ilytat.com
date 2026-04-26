const fs = require('fs');
const file = 'client/pages/strategy.vue';
let content = fs.readFileSync(file, 'utf8');

const search = `const getTasksForKR = (okrId: string, krId: string) => {
    return tasks.value?.filter(t => t.okrId === okrId && t.krId === krId) || []
}`;

const replace = `// ⚡ Bolt Performance Optimization:
// We replace the repeated O(N) array \`.filter()\` inside the template loops by pre-computing
// a Map in a \`computed\` property. This reduces the time complexity from O(K * T) (where K
// is the number of Key Results and T is the number of tasks) to an O(T) single-pass
// generation, allowing for O(1) lookups during renders.
const tasksByKrId = computed(() => {
    const map = new Map<string, Task[]>()
    if (!tasks.value) return map

    for (const task of tasks.value) {
        if (task.okrId && task.krId) {
            const key = \`\${task.okrId}-\${task.krId}\`
            let list = map.get(key)
            if (!list) {
                list = []
                map.set(key, list)
            }
            list.push(task)
        }
    }
    return map
})

const getTasksForKR = (okrId: string, krId: string) => {
    return tasksByKrId.value.get(\`\${okrId}-\${krId}\`) || []
}`;

content = content.replace(search, replace);
fs.writeFileSync(file, content);
console.log('patched');
