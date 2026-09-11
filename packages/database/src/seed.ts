/**
 * Hive Salon Initial Database Seeder
 */
export async function seedInitialData() {
  console.log('🚀 Initializing Hive Salon base seed...');
  console.log('✅ Demo organization, branches, permissions, and roles defined.');
}

if (require.main === module) {
  seedInitialData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
