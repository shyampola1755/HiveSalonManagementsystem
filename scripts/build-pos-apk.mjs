import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve('.');
const ANDROID_PROJECT_DIR = path.join(PROJECT_ROOT, 'apps', 'pos-android');
const APK_OUTPUT_DIR = path.join(PROJECT_ROOT, 'apk');

const JAVA_HOME = 'C:\\Users\\shyam\\.jdk\\jdk-17.0.20.1+1';
const ANDROID_HOME = 'C:\\Users\\shyam\\AppData\\Local\\Android\\Sdk';
const GRADLE_BIN = 'C:\\Users\\shyam\\.gradle\\wrapper\\dists\\gradle-8.14-all\\c2qonpi39x1mddn7hk5gh9iqj\\gradle-8.14\\bin\\gradle.bat';

console.log('🚀 Building Hive Salon POS Android APK...');

if (!fs.existsSync(APK_OUTPUT_DIR)) {
  fs.mkdirSync(APK_OUTPUT_DIR, { recursive: true });
}

const env = {
  ...process.env,
  JAVA_HOME,
  ANDROID_HOME,
  ANDROID_SDK_ROOT: ANDROID_HOME,
};

try {
  execSync(`"${GRADLE_BIN}" assembleDebug`, {
    cwd: ANDROID_PROJECT_DIR,
    env,
    stdio: 'inherit',
  });

  const builtApk = path.join(ANDROID_PROJECT_DIR, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const targetApk = path.join(APK_OUTPUT_DIR, 'hive-salon-pos.apk');

  if (fs.existsSync(builtApk)) {
    fs.copyFileSync(builtApk, targetApk);
    const stats = fs.statSync(targetApk);
    console.log(`\n✅ Successfully built Hive Salon POS APK!`);
    console.log(`📦 Output Location: ${targetApk}`);
    console.log(`📊 File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  } else {
    console.error('❌ Error: Output APK not found at ' + builtApk);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
}
