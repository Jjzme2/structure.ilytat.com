💡 What: Pre-compute OKR task relations
🎯 Why: Avoid O(N) filter in template
📊 Impact: Reduces N*M template overhead to O(1)
🔬 Measurement: Verify dashboard render with large tasks array
