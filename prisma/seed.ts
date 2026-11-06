import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local" });
config();

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// The 16 Local Government Areas of Kwara State (reference data, not financial data).
const LGAS = [
  ["asa", "Asa", "Afon", "126,435", "1,286 km²"],
  ["baruten", "Baruten", "Kosubosu", "209,432", "5,765 km²"],
  ["edu", "Edu", "Lafiagi", "134,520", "2,621 km²"],
  ["ekiti-kwara", "Ekiti (Kwara)", "Araromi-Opin", "58,921", "567 km²"],
  ["ifelodun", "Ifelodun", "Share", "149,278", "3,435 km²"],
  ["ilorin-east", "Ilorin East", "Oke-Oyi", "204,310", "486 km²"],
  ["ilorin-south", "Ilorin South", "Fufu", "225,198", "466 km²"],
  ["ilorin-west", "Ilorin West", "Ilorin", "365,221", "765 km²"],
  ["irepodun", "Irepodun", "Omu-Aran", "148,610", "1,095 km²"],
  ["isin", "Isin", "Owu-Isin", "62,475", "733 km²"],
  ["kaiama", "Kaiama", "Kaiama", "120,382", "4,025 km²"],
  ["moro", "Moro", "Bode Saadu", "108,792", "2,797 km²"],
  ["offa", "Offa", "Offa", "113,538", "344 km²"],
  ["oke-ero", "Oke Ero", "Iloffa", "56,970", "635 km²"],
  ["oyun", "Oyun", "Ilemona", "94,250", "632 km²"],
  ["patigi", "Patigi", "Patigi", "82,418", "1,485 km²"],
] as const;

async function main() {
  for (const [slug, name, headquarters, population, area] of LGAS) {
    await db.lga.upsert({
      where: { slug },
      update: { name, headquarters, population, area },
      create: { slug, name, headquarters, population, area },
    });
  }
  console.log(`Seeded ${LGAS.length} LGAs`);

  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set - skipping admin user.");
    return;
  }
  if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters");

  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: process.env.SEED_ADMIN_NAME || "Administrator",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${email}`);
}

main().finally(() => db.$disconnect());

