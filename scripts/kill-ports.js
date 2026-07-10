const { execSync } = require('child_process');

const ports = [3000, 4200];

ports.forEach((port) => {
  try {
    console.log(`🔍 Checking port ${port}...`);
    const result = execSync(
      `netstat -ano | findstr :${port}`,
      { encoding: 'utf-8' }
    );

    const lines = result.trim().split('\n');
    const pids = new Set();

    lines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') {
        pids.add(pid);
      }
    });

    pids.forEach((pid) => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { encoding: 'utf-8' });
        console.log(`  ✅ Killed PID ${pid} on port ${port}`);
      } catch {
        // Process may have already exited
      }
    });

    if (pids.size === 0) {
      console.log(`  ✅ Port ${port} is free`);
    }
  } catch {
    console.log(`  ✅ Port ${port} is free`);
  }
});

console.log('\n🚀 All ports cleared!\n');
