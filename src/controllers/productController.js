const pool = require("../../db");
exports.getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursorTime = req.query.cursorTime;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT * FROM products
    `;

    let conditions = [];
    let values = [];
    let index = 1;

    if (category) {
      conditions.push(`category = $${index}`);
      values.push(category);
      index++;
    }

    if (cursorTime && cursorId) {
      conditions.push(`(created_at, id) < ($${index}, $${index + 1})`);
      values.push(cursorTime);
      values.push(cursorId);
      index += 2;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      ORDER BY created_at DESC, id DESC
      LIMIT $${index}
    `;

    values.push(limit);

    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const last = result.rows[result.rows.length - 1];
      nextCursor = {
        created_at: last.created_at,
        id: last.id
      };
    }

    res.json({
      count: result.rows.length,
      nextCursor,
      products: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const result = await pool.query(
      `
      INSERT INTO products
      (name, category, price, created_at, updated_at)
      VALUES ($1,$2,$3,NOW(),NOW())
      RETURNING *
      `,
      [name, category, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET name=$1, category=$2, price=$3, updated_at=NOW()
      WHERE id=$4
      RETURNING *
      `,
      [name, category, price, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};