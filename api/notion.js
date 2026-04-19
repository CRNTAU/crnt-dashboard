const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const TASK_DB = "fe648de9-e1ce-46ca-93d1-087033e18698";
const CONTENT_DB = "bf73cc99-9e87-4397-9a88-e814bbd6a4b5";

const SPEND = [
  { item: "NPD — CYOS", paidBy: "James", aud: 4290, usd: 0 },
  { item: "Soft River — Branding", paidBy: "James", aud: 0, usd: 480 },
  { item: "Soft River — Additional", paidBy: "James", aud: 0, usd: 78 },
  { item: "GoDaddy — trycrnt.com", paidBy: "Georgina", aud: 22.97, usd: 0 },
];

const AUD_PER_USD = 1.58;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // PATCH — update a task status in Notion (two-way sync)
  if (req.method === "PATCH") {
    try {
      const { pageId, status } = req.body;
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: { select: { name: status } },
        },
      });
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — fetch all data
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  try {
    const [tasksRes, contentRes] = await Promise.all([
      notion.databases.query({
        database_id: TASK_DB,
        sorts: [{ property: "Due Date", direction: "ascending" }],
      }),
      notion.databases.query({ database_id: CONTENT_DB }),
    ]);

    const tasks = tasksRes.results.map((p) => ({
      id: p.id,
      task: p.properties.Task?.title?.[0]?.plain_text || "",
      status: p.properties.Status?.select?.name || "Not Started",
      owner: p.properties.Owner?.select?.name || "",
      area: p.properties.Area?.select?.name || "",
      priority: p.properties.Priority?.select?.name || "",
      dueDate: p.properties["Due Date"]?.date?.start || null,
      notes: p.properties.Notes?.rich_text?.[0]?.plain_text || "",
    }));

    const content = contentRes.results.map((p) => ({
      id: p.id,
      idea: p.properties.Idea?.title?.[0]?.plain_text || "",
      status: p.properties.Status?.select?.name || "",
      pillar: p.properties.Pillar?.select?.name || "",
    }));

    // Compute spend totals
    let totalAUD = 0;
    const spendItems = SPEND.map((s) => {
      const inAUD = s.aud + s.usd * AUD_PER_USD;
      totalAUD += inAUD;
      return { ...s, inAUD };
    });

    res.json({ tasks, content, spend: spendItems, totalAUD });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
