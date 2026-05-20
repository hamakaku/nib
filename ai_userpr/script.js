const form = document.getElementById("pr-form");
const resultSection = document.getElementById("result-section");
const resultText = document.getElementById("resultText");
const status = document.getElementById("status");
const copyButton = document.getElementById("copyButton");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "生成中です…しばらくお待ちください。";
    resultSection.classList.add("hidden");

    const data = {
        jobTitle: document.getElementById("jobTitle").value.trim(),
        experience: document.getElementById("experience").value.trim(),
        strength: document.getElementById("strength").value.trim(),
        tone: document.getElementById("tone").value,
    };

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("サーバー応答が不正です。");
        }

        const result = await response.json();
        resultText.textContent = result.prText || "生成に失敗しました。";
        resultSection.classList.remove("hidden");
        status.textContent = "生成が完了しました。";
    } catch (error) {
        console.error(error);
        status.textContent = "AIサーバーに接続できませんでした。ローカル生成を表示します。";
        resultText.textContent = generateFallbackText(data);
        resultSection.classList.remove("hidden");
    }
});

copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(resultText.textContent);
    status.textContent = "自己PRをコピーしました。";
});

function generateFallbackText({ jobTitle, experience, strength, tone }) {
    return `志望職種：${jobTitle}

${experience}の経験を活かして、${tone}な自己PRをお届けします。

私は${strength}を強みとしており、これまでの経験を通じて課題解決力を高めてきました。${jobTitle}のポジションでは、チームでの協調と実行力を大切にしながら、成果を生み出すために貢献したいと考えています。`;
}
