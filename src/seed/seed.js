const pool = require("../db");

const categories = [
  "electronics",
  "fashion",
  "books",
  "sports",
  "beauty"
];

function randomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function randomPrice() {
  return (Math.random() * 10000).toFixed(2);
}

async function seed() {
  console.log("Generating products...");

  const batchSize = 5000;

  for (let batch = 0; batch < 200000; batch += batchSize) {
    let values = [];
    let placeholders = [];
    let paramIndex = 1;

    for (let i = 0; i < batchSize; i++) {
      const name = `Product ${batch + i}`;
      const category = randomCategory();
      const price = randomPrice();

      const randomDate = new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      );

      placeholders.push(
        `($${paramIndex},$${paramIndex+1},$${paramIndex+2},$${paramIndex+3},$${paramIndex+4})`
      );

      values.push(
        name,
        category,
        price,
        randomDate,
        randomDate
      );

      paramIndex += 5;
    }

    const query = `
      INSERT INTO products
      (name, category, price, created_at, updated_at)
      VALUES ${placeholders.join(",")}
    `;

    await pool.query(query, values);

    console.log(`Inserted ${batch + batchSize}`);
  }

  console.log("Seed complete");
  process.exit();
}

seed();
