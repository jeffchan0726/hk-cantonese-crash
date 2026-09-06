# 開口講 — 香港廣東話速成

靜態 Web App：生存課、六聲操場、跟讀評分、生字卡、字典。  
繁體中文 + 粵拼 Jyutping，內容係香港口語。

## 即刻開

- Repo：https://github.com/jeffchan0726/hk-cantonese-crash
- 本機：用瀏覽器開 `index.html`，或 `npx serve .`
- GitHub Pages（建議）：
  1. 開 repo → **Settings** → **Pages**
  2. Source 擇 **Deploy from a branch**
  3. Branch 擇 **main**，資料夾 **/** (root)
  4. 儲存後約 1 分鐘，網址會係  
     `https://jeffchan0726.github.io/hk-cantonese-crash/`

語音辨識請用 **Chrome / Edge**，並允許麥克風。朗讀會優先用系統嘅香港粵語聲線。

## 入面有咩

| 頁 | 功能 |
|---|---|
| 今日 | 連續打卡、下一課、複習、聲調、開口挑戰 |
| 課程 | 12 堂生存課（打招呼、港鐵、茶餐廳、街市…） |
| 課文 | 聽原速／慢速拆音、跟讀評分、可接受近似答法 |
| 聲調 | 6 聲示範 + 聽音擇調 + 助詞 |
| 複習 | 簡易 SRS 生字卡 |
| 字典 | 搜漢字／粵拼／意思 |
| 我的 | 撞左上角 Logo：隱藏漢字、慢速、清進度 |

進度存 `localStorage`，唔經伺服器。
