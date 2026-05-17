require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"]
})

const router = require("./src/router").default
const Sitemap = require("react-router-sitemap").default
const fetch = require("node-fetch"); // 如果 Node 版本舊，需安裝此套件

async function generateSitemap() {
  try {
    const API_URL = "https://seafood-app.onrender.com/api/seafood";
    // 1. 抓取 API 所有的海鮮產品 ID
    // 請將網址換成你截圖中的 REACT_APP_API_URL
    const response = await fetch(API_URL)

    // 先檢查回應是否正常
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()
console.log("成功抓取資料，準備生成 Sitemap...")

// 格式化 ID (假設你的 API 回傳欄位是 _id)
    const idMap = data.map(item => ({ id: item._id }))

    // 2. 定義動態路由的參數映射
    const paramsConfig = {
      "/en/seafood/:id": idMap,
      "/zh/seafood/:id": idMap
    };

    // 3. 產生 Sitemap 並存檔
    new Sitemap(router)
      .applyParams(paramsConfig)
      .build("https://seafood-app-seven.vercel.app") // 你的網站網址
      .save("./public/sitemap.xml")

    console.log("✅ Sitemap 已成功生成在 public/sitemap.xml")
  } catch (e) {
    console.error("❌ 生成失敗:", e)
  }
}

generateSitemap()