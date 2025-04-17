# Miro Claude Agent

Tato aplikace pro Miro umožňuje uživatelům vybrat položky (např. kartičky, tvary) na Miro nástěnce a pomocí postranního panelu se na jejich obsah ptát umělé inteligence Claude od Anthropic.

## Předpoklady

*   **Node.js:** Verze 18.x nebo novější (LTS doporučeno).
*   **npm:** Správce balíčků pro Node.js (obvykle se instaluje spolu s Node.js).
*   **Účet Miro:** Potřebujete účet Miro pro přístup k Developer Hubu a testování aplikace.
*   **Miro Developer Tým:** Vytvořte si bezplatný Developer tým v Miro pro vývoj aplikací.
*   **Anthropic API Klíč:** Potřebujete API klíč pro přístup k modelům Claude. Získáte ho v [Anthropic Console](https://console.anthropic.com/).

## Nastavení

1.  **Klonování Repozitáře (pokud je kód v repozitáři):**
    ```bash
    git clone <URL_repozitáře>
    cd miro-claude-agent
    ```
    Pokud kód nemáte v repozitáři, ujistěte se, že jste v adresáři `miro-claude-agent`.

2.  **Vytvoření Aplikace v Miro:**
    *   Přejděte do [Miro Developer Hubu](https://miro.com/developers/apps/).
    *   Vytvořte novou aplikaci ve vašem Developer týmu.
    *   Poznamenejte si **Client ID** a **Client Secret** z karty "App Credentials".
    *   Přejděte na kartu "App Settings" -> "Edit App Manifest".
    *   Vložte následující JSON manifest (nebo odpovídající YAML):
        ```json
        {
          "appName": "Miro Claude Agent",
          "sdkVersion": "SDK_V2",
          "sdkUri": "http://localhost:3000",
          "appUi": {
            "panel": {
              "url": "http://localhost:3000"
            }
          },
          "scopes": [
            "boards:read",
            "boards:write"
          ]
        }
        ```
    *   **Uložte** manifest.

3.  **Vytvoření `.env` souboru:**
    *   V kořenovém adresáři projektu `miro-claude-agent` vytvořte soubor s názvem `.env`.
    *   Zkopírujte do něj následující obsah a nahraďte zástupné symboly vašimi skutečnými údaji:
        ```dotenv
        MIRO_CLIENT_ID=VASE_MIRO_CLIENT_ID
        MIRO_CLIENT_SECRET=VAS_MIRO_CLIENT_SECRET
        MIRO_REDIRECT_URL="http://localhost:3000/api/redirect" # Toto obvykle není potřeba měnit
        CLAUDE_API_KEY=VAS_CLAUDE_API_KLIC
        ```

4.  **Instalace Závislostí:**
    *   V terminálu, v adresáři `miro-claude-agent`, spusťte:
        ```bash
        npm install
        ```

## Spuštění Aplikace (Vývojový Server)

1.  V terminálu, v adresáři `miro-claude-agent`, spusťte:
    ```bash
    npm run start
    ```
2.  Server by se měl spustit na adrese `http://localhost:3000`. Pokud je port 3000 obsazený, Next.js může automaticky použít jiný port (např. 3001, 3002). Terminál vám ukáže, na jaké adrese server běží. **Poznámka:** Manifest v Miro by měl stále odkazovat na port 3000.

## Použití Aplikace v Miro

1.  Otevřete Miro nástěnku ve vašem Developer týmu.
2.  Klikněte na ikonu `+` nebo `...` v levém panelu nástrojů a zvolte "Get more apps".
3.  Vyhledejte název vaší aplikace ("Miro Claude Agent"). Měla by se zobrazit jako vývojová aplikace.
4.  Klikněte na ni a zvolte "Add" nebo "Install".
5.  Pokud budete vyzváni, autorizujte aplikaci (povolte přístup k `boards:read` a `boards:write`).
6.  Ikona aplikace by se měla objevit v levém panelu nástrojů.
7.  Klikněte na ikonu aplikace pro otevření postranního panelu.
8.  Vyberte jednu nebo více položek na nástěnce, které obsahují text.
9.  Do vstupního pole v panelu napište svou otázku ohledně vybraných položek.
10. Klikněte na tlačítko "Ask Claude".
11. Odpověď od Claude by se měla zobrazit pod tlačítkem. 