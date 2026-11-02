# Gemini API · SAD 期中考網站內 AI 批改設定

網站的 38 題模擬考和批改介面已存在於 GitHub Pages。本專案使用 **Gemini Developer API**，不是 OpenAI API。

## Important: Google AI Pro and Gemini API are different

Google AI Pro 提高 Gemini App/Google AI Studio 的一些使用權益，**不等於網站的 Gemini API 無限使用額度**。部分模型/專案可使用獨立 Free Tier；請在 Google AI Studio 確認 Free tier eligibility 和 Rate Limits。不想支付費用，請勿啟用 Cloud Billing / Paid Tier。

免費 API 提交的內容可能被 Google 用於改善產品，因此不要上傳真實患者個資或秘密。

## 1. 申請 Gemini API Key
1. 前往 https://aistudio.google.com/apikey ，使用 Google 帳號登入。
2. 建立或選擇 API Project，建立 API Key。**請勿在對話、GitHub、網頁原始碼貼出金鑰**。
3. 確認所選 Project 可以使用 Free Tier，且目標模型有免費配額。
4. 不需要為了試用 Free Tier 開啟付費 Billing。某些專案可能無法使用免費方案。

## 2. Cloudflare Worker 部署
1. 前往 https://dash.cloudflare.com/ ，建立帳號/登入。
2. Workers & Pages → Create → Worker。
3. 將 repository 的 `ai-grading-worker.js` 內容貼入 Worker 程式編輯器，Deploy。
4. Settings → Variables and Secrets 設定：
   - **Secret** `GEMINI_API_KEY` = 你的 Gemini API Key
   - Text `ALLOWED_ORIGIN` = `https://quuuiii.github.io`
   - Text `MODEL` = `gemini-2.5-flash` （選用，務必確認目前可用及你的免費配額）
5. Deploy 設定變更。Cloudflare 會提供 `https://...workers.dev` endpoint。

## 3. 網站內批改
1. 前往 https://quuuiii.github.io/SAD-Final-Review/
2. 進入期中模擬試題，完成考試並提交。
3. 在 Secure grading endpoint 欄位貼上你的 HTTPS Worker URL。
4. 點「🤖 AI 批改全部簡答題」，網站送出最多12題文字答案，Worker 回傳 `{grades:[{id,score,feedback,improvement}]}`。

## 安全性 / 費用
- Never put API Key in the GitHub Pages HTML.
- CORS origin check is **not authentication**. Current Worker is for private testing; do not advertise the endpoint publicly.
- Public deployment needs user authentication, rate limits, usage caps and abuse controls.
- Gemini free-tier limits can be exhausted, returning 429; free use is **not unlimited**.
- AI grades may be inaccurate; compare with the rubric and teacher's official evaluation.
- Without Worker, the website's Copy grading prompt still works and can be pasted into Gemini or ChatGPT manually.
